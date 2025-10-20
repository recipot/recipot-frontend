import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  UserInfo,
  TokenResponse,
} from '../../types/src/auth.types';

// Axios 인스턴스 생성
const createAuthApiInstance = (): AxiosInstance => {
  // 개발 환경에서는 Mock 서버를 사용하기 위해 baseURL을 비워둡니다
  const baseURL =
    process.env.NODE_ENV === 'development'
      ? '' // MSW가 현재 도메인에서 요청을 가로챔
      : process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.recipot.com'; // 기본값 제공

  // 이제 기본값을 제공하므로 에러 체크가 필요하지 않습니다

  const instance = axios.create({
    baseURL,
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
  async getKakaoLoginUrl(): Promise<string> {
    try {
      const response = await authApi.get('/v1/login/kakao');

      if (process.env.NODE_ENV === 'development') {
        // Mock 환경에서는 authUrl을 반환
        return response.data.authUrl;
      } else {
        // 실제 환경에서는 카카오 인증 서버 URL을 반환
        return response.data.authUrl;
      }
    } catch (error) {
      throw new Error('카카오 로그인 URL 생성에 실패했습니다.', {
        cause: error,
      });
    }
  },

  // 카카오 콜백에서 토큰 받기 (GET 요청)
  async getTokenFromCallback(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
  }> {
    try {
      const response = await authApi.get(
        `/v1/login/kakao/callback?code=${code}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error('카카오 로그인 처리에 실패했습니다.');
    }
  },

  // 구글 로그인 URL 생성
  async getGoogleLoginUrl(): Promise<string> {
    try {
      const response = await authApi.get('/v1/login/google');

      if (process.env.NODE_ENV === 'development') {
        // Mock 환경에서는 authUrl을 반환
        return response.data.authUrl;
      } else {
        // 실제 환경에서는 구글 인증 서버 URL을 반환
        return response.data.authUrl;
      }
    } catch (error) {
      throw new Error('구글 로그인 URL 생성에 실패했습니다.');
    }
  },

  // 구글 콜백에서 토큰 받기 (GET 요청)
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
      throw new Error('구글 로그인 처리에 실패했습니다.');
    }
  },

  // 백엔드에서 JWT 토큰 검증
  async verifyToken(token: string): Promise<AuthResponse<UserInfo>> {
    try {
      const response = await authApi.post<AuthResponse<UserInfo>>(
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

  // 사용자 정보 조회 (현재 로그인된 사용자)
  async getUserInfo(token: string): Promise<UserInfo> {
    try {
      const response = await authApi.get<UserInfo>('/v1/user/profile/me', {
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
