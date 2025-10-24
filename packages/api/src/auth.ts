import axios, { AxiosInstance } from 'axios';
import { UserInfo, TokenResponse } from '../../types/src/auth.types';

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
    return this.getAuthStorage()?.state?.refreshToken ?? null;
  },

  saveTokens(token: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    const authStorage: AuthStorage = {
      state: { token, refreshToken, user: null },
      version: STORAGE_VERSION,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStorage));
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },
};

const redirectToSignIn = (): void => {
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
    window.location.href = '/signin';
  }
};

const shouldAddAuthHeader = (url?: string): boolean => {
  if (!url) return false;

  const publicEndpoints = ['/v1/login/', '/v1/auth/debug', '/v1/health'];
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

      const requestUrl = error.config?.url ?? '';

      if (requestUrl.includes('/v1/auth/refresh')) {
        storage.clear();
        redirectToSignIn();
        return Promise.reject(error);
      }

      const refreshToken = storage.getRefreshToken();
      if (!refreshToken || error.config._retry) {
        storage.clear();
        redirectToSignIn();
        return Promise.reject(error);
      }

      error.config._retry = true;

      try {
        const response = await instance.post('/v1/auth/refresh', { refreshToken });

        if (response.data?.status === 200 && response.data?.data?.accessToken) {
          const newToken = response.data.data.accessToken;
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return instance.request(error.config);
        }
      } catch {
        storage.clear();
        redirectToSignIn();
      }

      return Promise.reject(error);
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
    return response.data.authUrl;
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
    const response = await authApi.get(`/v1/login/google/callback?code=${code}`);
    return response.data.data;
  },

  async verifyToken(token?: string): Promise<{ success: boolean; data: UserInfo; message: string }> {
    if (token) {
      storage.saveTokens(token, '');
    }

    const response = await authApi.post('/v1/auth/verify', {});

    if (response.data?.status === 200 && response.data?.data?.isValid) {
      const userInfo = await this.getUserInfo();
      return { success: true, data: userInfo, message: 'Token verified' };
    }

    throw new Error('Invalid token');
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await authApi.post<TokenResponse>('/v1/auth/refresh', { refreshToken });
    return response.data;
  },

  async getUserInfo(): Promise<UserInfo> {
    const response = await authApi.get('/v1/users/profile/me');
    return response.data.status === 200 ? response.data.data : response.data;
  },

  async updateProfile(updates: Partial<Pick<UserInfo, 'nickname' | 'isFirstEntry'>>): Promise<UserInfo> {
    const response = await authApi.patch('/v1/users/profile', updates);
    return response.data.status === 200 ? response.data.data : response.data;
  },

  async getDebugToken(userId: number, role: string = 'U01001'): Promise<AuthTokens> {
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
  clearTokens: () => storage.clear(),
};
