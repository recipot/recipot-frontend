import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { UserInfo, TokenResponse } from '../../types/src/auth.types';

// 토큰 관리 유틸리티 함수들
// 주의: 이 함수들은 authStore persist와 동기화되어야 합니다
const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Zustand persist에서 토큰 읽기 (auth-storage)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed.state?.token) {
          return parsed.state.token;
        }
      } catch (error) {
        console.error('토큰 파싱 실패:', error);
      }
    }
  }
  return null;
};

const getStoredRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Zustand persist에서 리프레시 토큰 읽기 (auth-storage)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed.state?.refreshToken) {
          return parsed.state.refreshToken;
        }
      } catch (error) {
        console.error('리프레시 토큰 파싱 실패:', error);
      }
    }
  }
  return null;
};

const clearStoredTokens = (): void => {
  if (typeof window !== 'undefined') {
    // Zustand persist 저장소 제거
    localStorage.removeItem('auth-storage');
  }
};

// 인증 헤더가 필요한 엔드포인트 판별
const shouldAddAuthHeader = (url?: string): boolean => {
  if (!url) return false;

  // 인증이 필요하지 않은 엔드포인트
  const noAuthPatterns = [
    '/v1/login/', // 모든 로그인 관련 엔드포인트
    '/v1/auth/debug', // 개발 환경 디버그 토큰 발급
    '/v1/health', // 헬스체크
  ];

  if (noAuthPatterns.some(pattern => url.includes(pattern))) {
    return false;
  }

  return true;
};

// 안전한 내부 경로로 리다이렉트
const safeRedirect = (path: string): void => {
  if (typeof window === 'undefined') return;

  // 상대 경로만 허용 (외부 URL 차단)
  if (path.startsWith('/') && !path.startsWith('//')) {
    window.location.href = path;
  } else {
    console.error('안전하지 않은 리다이렉트 시도:', path);
  }
};

const createAuthApiInstance = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키를 항상 포함하여 백엔드가 인증 정보를 받을 수 있도록 설정
  });

  instance.interceptors.request.use(
    config => {
      const url = config.url ?? '';

      // 백엔드는 Authorization Bearer 헤더 방식으로 인증
      // 쿠키는 초기 토큰 전달용, 이후 LocalStorage에서 읽어서 헤더에 추가
      if (shouldAddAuthHeader(url)) {
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
        const requestUrl = error.config?.url ?? '';

        // /v1/auth/refresh 요청 자체가 실패한 경우는 재시도하지 않음
        if (requestUrl.includes('/v1/auth/refresh')) {
          console.error(
            '❌ Refresh token이 유효하지 않습니다. 로그인이 필요합니다.'
          );
          clearStoredTokens();

          if (typeof window !== 'undefined') {
            if (!window.location.pathname.includes('/signin')) {
              safeRedirect('/signin');
            }
          }
          return Promise.reject(error);
        }

        // 토큰이 전혀 없는 경우 refresh 시도하지 않음
        const accessToken = getStoredToken();
        const refreshToken = getStoredRefreshToken();

        if (!accessToken && !refreshToken) {
          console.warn('⚠️ 토큰이 없습니다. 로그인 페이지로 이동합니다.');

          if (typeof window !== 'undefined') {
            if (!window.location.pathname.includes('/signin')) {
              safeRedirect('/signin');
            }
          }
          return Promise.reject(error);
        }

        if (refreshToken && !error.config._retry) {
          error.config._retry = true;

          try {
            console.info('🔄 토큰 갱신 시도 중...');
            const response = await instance.post('/v1/auth/refresh', {
              refreshToken: refreshToken,
            });

            if (
              response.data.status === 200 &&
              response.data.data?.accessToken
            ) {
              const newToken = response.data.data.accessToken;
              // 주의: 토큰 갱신 시 authStore도 업데이트해야 하지만,
              // 순환 참조를 피하기 위해 여기서는 요청만 재시도
              // authStore의 verifyAndRefreshToken이 상태를 동기화함
              error.config.headers.Authorization = `Bearer ${newToken}`;
              console.info('✅ 토큰 갱신 성공 (authStore 동기화 필요)');
              return instance.request(error.config);
            }
          } catch (refreshError) {
            console.error('❌ 토큰 갱신 실패:', refreshError);
            // refresh 실패 시 토큰 제거하고 로그인 페이지로
            clearStoredTokens();

            if (typeof window !== 'undefined') {
              if (!window.location.pathname.includes('/signin')) {
                safeRedirect('/signin');
              }
            }
            return Promise.reject(refreshError);
          }
        }

        // refreshToken이 없거나 이미 재시도한 경우
        console.warn('⚠️ Refresh token이 없거나 이미 재시도했습니다.');
        clearStoredTokens();

        if (typeof window !== 'undefined') {
          if (!window.location.pathname.includes('/signin')) {
            safeRedirect('/signin');
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

        // 임시로 토큰을 localStorage에 저장 (getUserInfo가 읽을 수 있도록)
        // 실제 authStore 저장은 호출자가 담당
        if (typeof window !== 'undefined') {
          const tempStorage = {
            state: {
              token: data.accessToken,
              refreshToken: data.refreshToken,
              user: null,
            },
            version: 0,
          };
          localStorage.setItem('auth-storage', JSON.stringify(tempStorage));
        }

        // 사용자 정보 조회 (위에서 저장한 토큰으로 인증)
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
      // 토큰이 제공되면 임시로 저장 (axios interceptor가 사용할 수 있도록)
      if (token && typeof window !== 'undefined') {
        const tempStorage = {
          state: {
            token,
            refreshToken: null,
            user: null,
          },
          version: 0,
        };
        localStorage.setItem('auth-storage', JSON.stringify(tempStorage));
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

  async checkTokenExpiration(token: string): Promise<{
    isExpired: boolean;
    expiresAt: string;
  }> {
    try {
      const response = await authApi.get(`/v1/auth/expiration/${token}`);
      return response.data;
    } catch (error) {
      console.error('토큰 만료 확인 실패:', error);
      throw new Error('토큰 만료 확인에 실패했습니다.');
    }
  },

  // TODO: 백엔드 API 구현 대기 중
  // 현재는 클라이언트에서만 호출하고 백엔드 연동은 추후 진행 예정
  async updateProfile(
    updates: Partial<Pick<UserInfo, 'nickname' | 'isFirstEntry'>>
  ): Promise<UserInfo> {
    try {
      const response = await authApi.patch('/v1/users/profile', updates);

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
      throw new Error('프로필 업데이트에 실패했습니다.');
    }
  },

  // 개발 환경용 디버그 토큰 발급
  async getDebugToken(
    userId: number,
    role: string = 'U01001'
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
  }> {
    try {
      console.info('🔧 [개발모드] 디버그 토큰 발급 중...', { userId, role });

      const response = await authApi.post(
        '/v1/auth/debug',
        {
          userId,
          role,
        },
        {
          withCredentials: false, // 디버그 토큰 발급은 인증 불필요
        }
      );

      if (response.data.status === 200 && response.data.data) {
        const data = response.data.data;

        // 임시로 토큰을 localStorage에 저장 (getUserInfo가 읽을 수 있도록)
        // 실제 authStore 저장은 호출자가 담당
        if (typeof window !== 'undefined') {
          const tempStorage = {
            state: {
              token: data.accessToken,
              refreshToken: data.refreshToken,
              user: null,
            },
            version: 0,
          };
          localStorage.setItem('auth-storage', JSON.stringify(tempStorage));
        }

        // 사용자 정보 조회 (위에서 저장한 토큰으로 인증)
        const userInfo = await this.getUserInfo();

        console.info('✅ [개발모드] 디버그 토큰 발급 성공');

        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn ?? 3600,
          user: userInfo,
        };
      } else {
        throw new Error('디버그 토큰 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('❌ [개발모드] 디버그 토큰 발급 실패:', error);
      throw new Error('디버그 토큰 발급에 실패했습니다.', { cause: error });
    }
  },
};

// 토큰 관리 유틸리티 함수들을 외부에서 사용할 수 있도록 export
export const tokenUtils = {
  getToken: getStoredToken,
  getRefreshToken: getStoredRefreshToken,
  clearTokens: clearStoredTokens,
};
