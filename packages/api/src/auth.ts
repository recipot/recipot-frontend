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

// Axios 인스턴스 생성
const createAuthApiInstance = (): AxiosInstance => {
  // 환경 확인 (NEXT_PUBLIC_APP_ENV 사용)
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'production';
  const isDev = APP_ENV === 'development';
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.info(`🌍 앱 환경: ${APP_ENV}`);
  console.info(`🔗 백엔드 URL: ${baseURL}`);
  console.info(
    `🔐 인증 방식: ${isDev ? 'LocalStorage + Authorization 헤더' : 'httpOnly 쿠키'}`
  );

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    // 개발(localhost + dev.hankkibuteo.com): LocalStorage (false)
    // 프로덕션(www.hankkibuteo.com): httpOnly 쿠키 (true)
    withCredentials: !isDev,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    config => {
      const url = config.url ?? '';

      // 개발 환경: LocalStorage에서 토큰 읽어서 Authorization 헤더 추가
      // 프로덕션: httpOnly 쿠키 사용 (헤더 추가 안 함)
      if (isDev && shouldAddAuthHeader(url)) {
        const token = getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 요청 로깅 (개발 환경에서만)
      if (isDev) {
        const authHeader = config.headers.Authorization;
        const authInfo =
          authHeader && typeof authHeader === 'string'
            ? `(Authorization: ${authHeader.substring(0, 20)}...)`
            : '(인증 없음)';
        console.info(
          `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
          authInfo
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
    async error => {
      console.error(
        '[API Response Error]',
        error.response?.data || error.message
      );

      // 토큰 만료 등의 인증 에러 처리
      if (error.response?.status === 401) {
        console.warn('인증 토큰이 만료되었습니다.');

        // 토큰 갱신 시도
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && !error.config._retry) {
          error.config._retry = true; // 무한 루프 방지

          try {
            console.log('토큰 갱신 시도 중...');
            const response = await instance.post('/v1/auth/refresh', {
              refreshToken: refreshToken,
            });

            if (
              response.data.status === 200 &&
              response.data.data?.accessToken
            ) {
              const newToken = response.data.data.accessToken;
              setStoredToken(newToken);

              // 원래 요청을 새 토큰으로 재시도
              error.config.headers.Authorization = `Bearer ${newToken}`;
              console.log('토큰 갱신 성공, 원래 요청 재시도');
              return instance.request(error.config);
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
          }
        }

        // 토큰 갱신 실패 시 로그아웃 처리
        removeStoredToken();

        // 브라우저 환경에서만 리다이렉트
        if (typeof window !== 'undefined') {
          // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
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
  // 카카오 로그인 URL 생성 (백엔드 리다이렉트 방식)
  async getKakaoLoginUrl() {
    try {
      // 백엔드가 자체적으로 redirect_uri를 백엔드 주소로 설정
      const response = await authApi.get('/v1/login/kakao');
      console.log('카카오 로그인 URL 생성 성공:', response.data);

      // 실제 백엔드 응답: { status: 200, data: "https://kauth.kakao.com/oauth/authorize?..." }
      if (response.data.status === 200 && response.data.data) {
        const kakaoUrl = response.data.data;
        console.log('카카오 OAuth URL (백엔드 리다이렉트):', kakaoUrl);

        // 백엔드 주소로 리다이렉트되는 것이 정상
        if (
          kakaoUrl.includes('redirect_uri=http%3A%2F%2Fapi.hankkibuteo.com') ||
          kakaoUrl.includes('redirect_uri=https%3A%2F%2Fapi.hankkibuteo.com')
        ) {
          console.log('✅ 백엔드 리다이렉트 방식으로 설정됨');
        }

        return kakaoUrl;
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

  // 사용자 ID로 토큰 정보 조회 (백엔드 방식)
  async getTokenByUserId(userId: number) {
    try {
      console.info('🔍 [getTokenByUserId] 사용자 토큰 정보 조회 시작:', {
        userId,
        timestamp: new Date().toISOString(),
      });

      const response = await authApi.get(`/v1/auth/info/${userId}`);
      console.info('📦 [getTokenByUserId] 백엔드 응답:', response.data);

      if (response.data.status === 200 && response.data.data) {
        const data = response.data.data;

        console.info('✅ [getTokenByUserId] 토큰 수신 성공');
        console.info(
          `🔑 [getTokenByUserId] Access Token: ${data.accessToken.substring(0, 30)}...`
        );
        console.info(
          `🔑 [getTokenByUserId] Refresh Token: ${data.refreshToken.substring(0, 30)}...`
        );

        // 토큰 저장
        setStoredToken(data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        console.info('💾 [getTokenByUserId] 토큰 LocalStorage에 저장 완료');

        // 사용자 정보 조회
        console.info('👤 [getTokenByUserId] 사용자 정보 조회 시작...');
        const userInfo = await this.getUserInfo();
        console.info('👤 [getTokenByUserId] 사용자 정보 조회 성공:', userInfo);

        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: 3600, // 계산 필요 시 accessExpiresAt 사용
          user: userInfo,
        };
      } else {
        console.error(
          '❌ [getTokenByUserId] 토큰 정보 응답 형식 오류:',
          response.data
        );
        throw new Error('토큰 정보 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('❌ [getTokenByUserId] 토큰 정보 조회 실패:', error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        console.error('📝 [getTokenByUserId] 에러 상세:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
        });
      }
      throw new Error('토큰 정보 조회에 실패했습니다.', { cause: error });
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

  // 카카오 콜백에서 userId 받기
  async getKakaoCallback(code: string): Promise<{
    userId: number;
  }> {
    try {
      console.log('카카오 콜백 처리 시작:', { code });

      const response = await authApi.get(
        `/v1/login/kakao/callback?code=${code}`
      );

      console.log('카카오 콜백 응답:', response.data);

      // 백엔드 응답: { status: 200, data: { userId: 3 } }
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

  // 카카오 로그인 완료 (콜백에서 userId를 받아 토큰으로 변환)
  async completeKakaoLogin(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
  }> {
    try {
      // 1. 카카오 콜백으로 userId 받기
      const { userId } = await this.getKakaoCallback(code);
      console.log('카카오 로그인 userId:', userId);

      // 2. userId로 토큰 정보 받기
      const tokenData = await this.getTokenByUserId(userId);
      console.log('토큰 발급 완료:', tokenData);

      return tokenData;
    } catch (error) {
      console.error('카카오 로그인 완료 처리 실패:', error);
      throw new Error('카카오 로그인 완료 처리에 실패했습니다.', {
        cause: error,
      });
    }
  },

  // 백엔드에서 JWT 토큰 검증
  async verifyToken(token?: string) {
    try {
      // 토큰이 제공되면 임시로 저장 (인터셉터에서 사용하기 위해)
      if (token) {
        setStoredToken(token);
      }

      const response = await authApi.post('/v1/auth/verify', {});

      console.log('토큰 검증 응답:', response.data);

      // 실제 백엔드 응답: { status: 200, data: { isValid: true, isExpired: false, expiresAt: "..." } }
      if (response.data.status === 200 && response.data.data?.isValid) {
        // 토큰이 유효하면 사용자 정보를 별도로 가져와야 함
        try {
          const userInfo = await this.getUserInfo();
          return {
            success: true,
            data: userInfo,
            message: '토큰 검증 성공',
          };
        } catch (userError) {
          // 사용자 정보 조회 실패 시 기본 정보로 처리
          console.warn('사용자 정보 조회 실패, 기본 정보 사용:', userError);
        }
      } else {
        throw new Error('토큰이 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('토큰 검증 에러:', error);
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
  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await authApi.get('/v1/users/profile/me');
      console.info('✅ 사용자 정보 조회 응답:', response.data);

      // 백엔드 응답 형식: { status: 200, data: { id, email, name } }
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error('❌ 사용자 정보 조회 에러:', error);
      throw new Error('사용자 정보 조회에 실패했습니다.');
    }
  },

  // 토큰 만료 확인
  async checkTokenExpiration(): Promise<{
    isExpired: boolean;
    expiresAt: string;
  }> {
    try {
      const response = await authApi.get('/v1/auth/expiration/{token}');
      return response.data;
    } catch (error) {
      throw new Error('토큰 만료 확인에 실패했습니다.');
    }
  },

  // 로그아웃
  async logout(): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/v1/auth/logout', {});

      // 로그아웃 성공 시 로컬 토큰도 제거
      removeStoredToken();

      return response.data;
    } catch (error) {
      // 로그아웃 실패해도 로컬 토큰은 제거
      removeStoredToken();
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
