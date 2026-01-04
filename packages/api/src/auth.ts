import axios, { AxiosInstance } from 'axios';

import { getCookie } from '@recipot/utils';
import { UserInfo, TokenResponse } from '@recipot/types';

import { guestSession } from './guestSession';

const AUTH_STORAGE_KEY = 'auth-storage';
const STORAGE_VERSION = 0;

interface AuthStorage {
  state: {
    token: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
  };
  version: number;
}

const storage = {
  getAuthStorage(): AuthStorage | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return this.getAuthStorage()?.state?.token ?? null;
  },

  getRefreshToken(): string | null {
    const stored = this.getAuthStorage()?.state?.refreshToken ?? null;
    if (stored && stored.length > 0) {
      return stored;
    }

    if (typeof document !== 'undefined') {
      return getCookie('refreshToken');
    }

    return null;
  },

  saveTokens(token: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    // 기존 storage에서 user 정보를 유지
    const existingStorage = this.getAuthStorage();
    const existingUser = existingStorage?.state?.user ?? null;

    const authStorage: AuthStorage = {
      state: { token, refreshToken, user: existingUser },
      version: STORAGE_VERSION,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStorage));

    // zustand store 동기화를 위한 커스텀 이벤트 발생
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth-token-updated', {
          detail: { token, refreshToken },
        })
      );
    }
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },
};

const redirectToSignIn = (): void => {
  if (
    typeof window !== 'undefined' &&
    !window.location.pathname.includes('/signin')
  ) {
    window.location.href = '/signin';
  }
};

const isProduction = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV || 'production';
  return env === 'production';
};

const shouldAddAuthHeader = (url?: string): boolean => {
  if (!url) return false;

  // 프로덕션에서 쿠키 기반 인증 사용 시 verify 엔드포인트는 Authorization 헤더 추가 안 함
  const useCookieAuth = isProduction();

  const publicEndpoints = [
    '/v1/login/',
    '/v1/auth/debug',
    '/v1/health',
    '/v1/auth/refresh',
    ...(useCookieAuth ? ['/v1/auth/verify'] : []),
  ];
  return !publicEndpoints.some(endpoint => url.includes(endpoint));
};

const createAuthApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    config => {
      if (shouldAddAuthHeader(config.url)) {
        const token = storage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      const originalRequest = error.config ?? {};
      const requestUrl = originalRequest.url ?? '';

      if (requestUrl.includes('/v1/auth/refresh')) {
        storage.clear();
        redirectToSignIn();
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        storage.clear();
        redirectToSignIn();
        return Promise.reject(error);
      }

      const storedRefreshToken = storage.getRefreshToken();
      const hasStoredCredentials = Boolean(storedRefreshToken);

      originalRequest._retry = true;

      try {
        const response = await instance.post(
          '/v1/auth/refresh',
          hasStoredCredentials ? { refreshToken: storedRefreshToken } : {}
        );

        const responseStatus =
          typeof response.data?.status === 'number'
            ? response.data.status
            : response.status;
        const responseData = response.data?.data ?? response.data;
        const newAccessToken = responseData?.accessToken;
        const newRefreshToken = responseData?.refreshToken;

        if (hasStoredCredentials) {
          if (!newAccessToken) {
            throw new Error('No access token returned from refresh.');
          }

          // zustand store 동기화를 위해 저장
          storage.saveTokens(
            newAccessToken,
            newRefreshToken ?? storedRefreshToken ?? ''
          );
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
          const isSuccessful =
            typeof responseStatus === 'number' && responseStatus === 200;

          if (!isSuccessful) {
            throw new Error('Cookie-based refresh failed.');
          }

          if (originalRequest.headers?.Authorization) {
            delete originalRequest.headers.Authorization;
          }
        }

        return instance.request(originalRequest);
      } catch (refreshError) {
        storage.clear();
        redirectToSignIn();
        return Promise.reject(refreshError);
      }
    }
  );

  return instance;
};

const authApi = createAuthApiInstance();

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export const authService = {
  async getKakaoLoginUrl(): Promise<string> {
    const response = await authApi.get('/v1/login/kakao');
    return response.data.data;
  },

  async getGoogleLoginUrl(): Promise<string> {
    const response = await authApi.get('/v1/login/google');
    return response.data.data;
  },

  async getKakaoCallback(code: string): Promise<{ userId: number }> {
    const response = await authApi.get(`/v1/login/kakao/callback?code=${code}`);
    return { userId: response.data.data.userId };
  },

  async getTokenByUserId(userId: number): Promise<AuthTokens> {
    const response = await authApi.get(`/v1/auth/info/${userId}`);
    const data = response.data.data;

    storage.saveTokens(data.accessToken, data.refreshToken);
    const user = await this.getUserInfo();

    // 게스트 세션 데이터 마이그레이션
    await guestSession.migrateToUser();

    try {
      await guestSession.migrateToUser();
    } catch (error) {
      throw new Error('게스트 세션 마이그레이션 실패');
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: 3600,
      user,
    };
  },

  async completeKakaoLogin(code: string): Promise<AuthTokens> {
    const { userId } = await this.getKakaoCallback(code);
    return this.getTokenByUserId(userId);
  },

  async getTokenFromGoogleCallback(code: string): Promise<AuthTokens> {
    const response = await authApi.get(
      `/v1/login/google/callback?code=${code}`
    );
    const data = response.data.data;

    // 토큰 저장 후 게스트 세션 데이터 마이그레이션
    if (data.accessToken && data.refreshToken) {
      storage.saveTokens(data.accessToken, data.refreshToken);
      await guestSession.migrateToUser();
    }

    try {
      await guestSession.migrateToUser();
    } catch (error) {
      throw new Error('게스트 세션 마이그레이션 실패');
    }

    return data;
  },

  async verifyToken(token?: string): Promise<{
    success: boolean;
    data: UserInfo;
    message: string;
  }> {
    if (token) {
      const storedRefreshToken = storage.getRefreshToken() ?? '';
      storage.saveTokens(token, storedRefreshToken);
    }

    // 프로덕션 환경에서 쿠키 기반 인증 사용 시 /v1/auth/verify 호출 생략
    // getUserInfo() 호출만으로도 인증 검증이 가능 (인증 실패 시 axios 인터셉터가 자동 처리)
    const useCookieAuth = isProduction();

    if (useCookieAuth) {
      // 프로덕션: verify 엔드포인트 호출 없이 바로 사용자 정보 조회
      // getUserInfo가 실패하면 이미 인증이 유효하지 않은 것이므로 자동으로 처리됨
      const userInfo = await this.getUserInfo();
      return { success: true, data: userInfo, message: 'Token verified' };
    }

    // 개발 환경: 기존 로직 유지 (verify 엔드포인트 호출)
    const response = await authApi.post('/v1/auth/verify', {});

    if (response.data?.status === 200 && response.data?.data?.isValid) {
      const userInfo = await this.getUserInfo();
      return { success: true, data: userInfo, message: 'Token verified' };
    }

    throw new Error('Invalid token');
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await authApi.post<{
      status: number;
      data: TokenResponse;
    }>('/v1/auth/refresh', {
      refreshToken,
    });

    // axios 인터셉터와 일관성을 위해 data.data 반환
    if (response.data?.status === 200 && response.data?.data) {
      return response.data.data;
    }

    // 레거시 지원: 직접 TokenResponse를 반환하는 경우
    return response.data as unknown as TokenResponse;
  },

  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await authApi.get('/v1/users/profile/me');
      return response.data.status === 200 ? response.data.data : response.data;
    } catch (error: any) {
      // 401 에러는 로그인하지 않은 사용자의 정상적인 플로우이므로 조용히 처리
      const status = error?.response?.status;
      if (status !== 401) {
        console.error('[getUserInfo] 사용자 정보 조회 실패:', {
          message: error?.message,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          url: error?.config?.url,
          method: error?.config?.method,
          error,
        });
      }
      throw error;
    }
  },

  async updateProfile(
    updates: Partial<Pick<UserInfo, 'nickname' | 'isFirstEntry'>>
  ): Promise<UserInfo> {
    const response = await authApi.patch('/v1/users/profile', updates);
    return response.data.status === 200 ? response.data.data : response.data;
  },

  async getDebugToken(
    userId: number,
    role: string = 'U01001'
  ): Promise<AuthTokens> {
    const response = await authApi.post(
      '/v1/auth/debug',
      { userId, role },
      { withCredentials: false }
    );

    const data = response.data.data;
    storage.saveTokens(data.accessToken, data.refreshToken);
    const user = await this.getUserInfo();

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn ?? 3600,
      user,
    };
  },
};

export const tokenUtils = {
  getToken: () => storage.getToken(),
  getRefreshToken: () => storage.getRefreshToken(),
  saveTokens: (token: string, refreshToken: string) =>
    storage.saveTokens(token, refreshToken),
  clearTokens: () => storage.clear(),
};
