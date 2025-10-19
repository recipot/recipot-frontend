import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  UserInfo,
  TokenResponse,
} from '../../types/src/auth.types';

// 토큰 관리 유틸리티 함수들
const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const setStoredToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

const removeStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

// 인증 헤더가 필요한 엔드포인트 판별
const shouldAddAuthHeader = (url?: string): boolean => {
  if (!url) return false;

  // 인증이 필요하지 않은 엔드포인트
  const noAuthPatterns = [
    '/v1/login/', // 모든 로그인 관련 엔드포인트
    '/v1/auth/info/', // 사용자 ID로 토큰 조회 (토큰 발급 전)
    '/v1/health', // 헬스체크
  ];

  if (noAuthPatterns.some(pattern => url.includes(pattern))) {
    return false;
  }

  return true;
};

const createAuthApiInstance = (): AxiosInstance => {
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'production';
  const isDev = APP_ENV === 'development';
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: !isDev,
  });

  instance.interceptors.request.use(
    config => {
      const url = config.url ?? '';

      if (isDev && shouldAddAuthHeader(url)) {
        const token = getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    error => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      console.error(
        '[API Response Error]',
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !error.config._retry) {
          error.config._retry = true;

          try {
            const response = await instance.post('/v1/auth/refresh', {
              refreshToken: refreshToken,
            });

            if (
              response.data.status === 200 &&
              response.data.data?.accessToken
            ) {
              const newToken = response.data.data.accessToken;
              setStoredToken(newToken);
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return instance.request(error.config);
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
          }
        }

        removeStoredToken();

        if (typeof window !== 'undefined') {
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin';
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스
const authApi = createAuthApiInstance();

export const authService = {
  async getKakaoLoginUrl() {
    try {
      const response = await authApi.get('/v1/login/kakao');

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('카카오 로그인 URL 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 URL 생성 실패:', error);
      throw new Error('카카오 로그인 URL 생성에 실패했습니다.', {
        cause: error,
      });
    }
  },

  async getTokenByUserId(userId: number) {
    try {
      const response = await authApi.get(`/v1/auth/info/${userId}`);

      if (response.data.status === 200 && response.data.data) {
        const data = response.data.data;

        setStoredToken(data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        const userInfo = await this.getUserInfo();

        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: 3600,
          user: userInfo,
        };
      } else {
        throw new Error('토큰 정보 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('[getTokenByUserId] 토큰 정보 조회 실패:', error);
      throw new Error('토큰 정보 조회에 실패했습니다.', { cause: error });
    }
  },

  async getGoogleLoginUrl(): Promise<string> {
    try {
      const response = await authApi.get('/v1/login/google');
      return response.data.authUrl;
    } catch (error) {
      console.error('구글 로그인 URL 생성 실패:', error);
      throw new Error('구글 로그인 URL 생성에 실패했습니다.');
    }
  },

  async getTokenFromGoogleCallback(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
  }> {
    try {
      const response = await authApi.get(
        `/v1/login/google/callback?code=${code}`
      );
      return response.data.data;
    } catch (error) {
      console.error('구글 로그인 처리 실패:', error);
      throw new Error('구글 로그인 처리에 실패했습니다.');
    }
  },

  async getKakaoCallback(code: string): Promise<{
    userId: number;
  }> {
    try {
      const response = await authApi.get(
        `/v1/login/kakao/callback?code=${code}`
      );

      if (response.data.status === 200 && response.data.data?.userId) {
        return {
          userId: response.data.data.userId,
        };
      } else {
        throw new Error('카카오 콜백 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('카카오 콜백 처리 실패:', error);
      throw new Error('카카오 로그인 처리에 실패했습니다.', {
        cause: error,
      });
    }
  },

  async completeKakaoLogin(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
  }> {
    try {
      const { userId } = await this.getKakaoCallback(code);
      const tokenData = await this.getTokenByUserId(userId);
      return tokenData;
    } catch (error) {
      console.error('카카오 로그인 완료 처리 실패:', error);
      throw new Error('카카오 로그인 완료 처리에 실패했습니다.', {
        cause: error,
      });
    }
  },

  async verifyToken(token?: string) {
    try {
      if (token) {
        setStoredToken(token);
      }

      const response = await authApi.post('/v1/auth/verify', {});

      if (response.data.status === 200 && response.data.data?.isValid) {
        try {
          const userInfo = await this.getUserInfo();
          return {
            success: true,
            data: userInfo,
            message: '토큰 검증 성공',
          };
        } catch (userError) {
          console.warn('사용자 정보 조회 실패:', userError);
        }
      } else {
        throw new Error('토큰이 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('토큰 검증 에러:', error);
      throw new Error('토큰 검증에 실패했습니다.');
    }
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await authApi.post<TokenResponse>('/v1/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },

  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await authApi.get('/v1/users/profile/me');

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error('사용자 정보 조회 에러:', error);
      throw new Error('사용자 정보 조회에 실패했습니다.');
    }
  },

  async checkTokenExpiration(): Promise<{
    isExpired: boolean;
    expiresAt: string;
  }> {
    try {
      const response = await authApi.get('/v1/auth/expiration/{token}');
      return response.data;
    } catch (error) {
      console.error('토큰 만료 확인 실패:', error);
      throw new Error('토큰 만료 확인에 실패했습니다.');
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/v1/auth/logout', {});
      removeStoredToken();
      return response.data;
    } catch (error) {
      removeStoredToken();
      console.error('로그아웃 실패:', error);
      throw new Error('로그아웃에 실패했습니다.');
    }
  },
};

// 토큰 관리 유틸리티 함수들을 외부에서 사용할 수 있도록 export
export const tokenUtils = {
  getToken: getStoredToken,
  setToken: setStoredToken,
  removeToken: removeStoredToken,
};
