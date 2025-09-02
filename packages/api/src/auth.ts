import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  UserInfo,
  TokenResponse,
} from '../../types/src/auth.types';

// Axios 인스턴스 생성
const createAuthApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    config => {
      // 요청 로깅 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    error => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 응답 로깅 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
      }
      return response;
    },
    error => {
      console.error(
        '[API Response Error]',
        error.response?.data || error.message
      );

      // 토큰 만료 등의 인증 에러 처리
      if (error.response?.status === 401) {
        // 토큰 만료시 로그아웃 처리 등의 로직을 여기에 추가할 수 있습니다
        console.warn('인증 토큰이 만료되었습니다.');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스
const authApi = createAuthApiInstance();

export const authService = {
  // 카카오 로그인 URL 생성
  getKakaoLoginUrl(): string {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/login/kakao`;
  },

  // 백엔드에서 JWT 토큰 검증
  async verifyToken(token: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        '/v1/auth/verify',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('토큰 검증에 실패했습니다.');
    }
  },

  // 토큰 갱신
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await authApi.post<TokenResponse>('/v1/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  },

  // 사용자 정보 조회
  async getUserInfo(userId: string, token: string): Promise<UserInfo> {
    try {
      const response = await authApi.get<UserInfo>(`/v1/auth/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('사용자 정보 조회에 실패했습니다.');
    }
  },

  // 로그아웃
  async logout(token: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>(
        '/v1/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('로그아웃에 실패했습니다.');
    }
  },
};
