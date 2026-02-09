import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, guestSession } from '../../api/src';
import { UserInfo } from '../../types/src/auth.types';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  refreshIntervalId: NodeJS.Timeout | null;

  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: () => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  verifyAndRefreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

const isProduction = () =>
  process.env.NEXT_PUBLIC_APP_ENV !== 'development' &&
  process.env.NEXT_PUBLIC_APP_ENV !== 'local';

const isCookieAuthMode = () => isProduction();

/** 게스트 전용 경로 (인증 API 호출 스킵) */
const isGuestOnlyPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/ab-test');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // 디버그 모드에서 사용하는 공유 헬퍼 함수
      const handleDebugLogin = async (): Promise<void> => {
        const tokenData = await authService.getDebugToken(1, 'U01001');
        set({
          token: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          user: tokenData.user,
        });
      };

      // axios 인터셉터에서 토큰 갱신 시 zustand store 동기화
      if (typeof window !== 'undefined') {
        window.addEventListener('auth-token-updated', ((event: CustomEvent) => {
          const { token, refreshToken } = event.detail;
          set({ token, refreshToken });
        }) as EventListener);
      }

      return {
        user: null,
        token: null,
        refreshToken: null,
        loading: true,
        refreshIntervalId: null,

        setUser: (user: UserInfo | null) => set({ user }),
        setToken: (token: string | null) => set({ token }),
        setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
        setLoading: (loading: boolean) => set({ loading }),

        // 자동 토큰 갱신 시작 (50분마다 갱신 - 토큰 만료 전에 미리 갱신)
        startAutoRefresh: () => {
          const { refreshIntervalId } = get();

          // 이미 실행 중이면 중복 실행 방지
          if (refreshIntervalId) {
            return;
          }

          // 50분(3000초)마다 토큰 갱신 (토큰 유효기간은 보통 1시간)
          // 토큰 만료 전에 미리 갱신하여 사용자가 로그인 상태를 유지할 수 있도록 함
          const intervalId = setInterval(
            async () => {
              const { refreshToken } = get();

              if (!refreshToken) {
                return;
              }

              try {
                console.log('[Auth] 자동 토큰 갱신 시도...');
                const tokenResponse =
                  await authService.refreshToken(refreshToken);

                if (tokenResponse.accessToken && tokenResponse.refreshToken) {
                  console.log('[Auth] 토큰 자동 갱신 성공');
                  set({
                    token: tokenResponse.accessToken,
                    refreshToken: tokenResponse.refreshToken,
                  });
                }
              } catch (error) {
                console.error('[Auth] 토큰 자동 갱신 실패:', error);
                // 갱신 실패 시 로그아웃하지 않고 다음 갱신 시도를 기다림
                // 완전히 실패한 경우는 axios 인터셉터가 로그아웃 처리
              }
            },
            50 * 60 * 1000
          ); // 50분

          set({ refreshIntervalId: intervalId });
        },

        // 자동 토큰 갱신 중지
        stopAutoRefresh: () => {
          const { refreshIntervalId } = get();

          if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
            set({ refreshIntervalId: null });
          }
        },

        verifyAndRefreshToken: async () => {
          const { token } = get();
          const cookieAuth = isCookieAuthMode();

          if (!token) {
            if (cookieAuth) {
              try {
                const verified = await authService.verifyToken();
                set({ user: verified.data ?? null });
                return true;
              } catch (error: any) {
                // 401 에러는 로그인하지 않은 사용자의 정상적인 플로우이므로 조용히 처리
                const status = error?.response?.status;
                if (status !== 401) {
                  console.error('[Auth] 쿠키 기반 토큰 검증 실패:', error);
                }
                get().logout();
                return false;
              }
            }

            get().logout();
            return false;
          }

          try {
            // 토큰 검증 API 호출 - 만료 시 axios 인터셉터가 자동으로 재발급 처리
            const verified = await authService.verifyToken(token);
            set({ user: verified.data ?? null });
            return true;
          } catch (error) {
            // axios 인터셉터에서 재발급을 시도했지만 실패한 경우 (예: refreshToken도 만료)
            get().logout();
            return false;
          }
        },

        initializeAuth: async () => {
          set({ loading: true });

          // 게스트 전용 경로에서는 인증 API 호출 없이 바로 완료
          if (isGuestOnlyPath()) {
            set({ loading: false });
            return;
          }

          const { token, user } = get();
          const cookieAuth = isCookieAuthMode();

          if (!token) {
            // 게스트 세션 사용자는 인증 시도 없이 바로 완료
            if (guestSession.getSessionId()) {
              set({ loading: false });
              return;
            }

            if (cookieAuth) {
              try {
                const verified = await authService.verifyToken();
                set({ user: verified.data ?? null });
              } catch (error: any) {
                // 401 에러는 로그인하지 않은 사용자의 정상적인 플로우이므로 조용히 처리
                const status = error?.response?.status;
                if (status !== 401) {
                  console.error('[Auth] 쿠키 기반 초기화 실패:', error);
                }
              } finally {
                set({ loading: false });
              }
              return;
            }

            set({ loading: false });
            return;
          }

          if (user) {
            set({ loading: false });
            // 토큰이 있고 유저 정보가 있으면 자동 갱신 시작
            get().startAutoRefresh();
            return;
          }

          try {
            const userInfo = await authService.getUserInfo();
            set({ user: userInfo });
            // 유저 정보를 성공적으로 가져온 경우 자동 갱신 시작
            get().startAutoRefresh();
          } catch (error: any) {
            // 401 에러는 로그인하지 않은 사용자의 정상적인 플로우이므로 조용히 처리
            const status = error?.response?.status;
            if (status !== 401) {
              console.error('Failed to fetch user info:', error);
            }
          }

          set({ loading: false });
        },

        login: async () => {
          try {
            if (!isProduction()) {
              await handleDebugLogin();
              // 디버그 로그인 성공 시 자동 갱신 시작
              get().startAutoRefresh();
              return;
            }

            const kakaoUrl = await authService.getKakaoLoginUrl();
            window.location.href = kakaoUrl;
          } catch (error) {
            console.error('Login failed:', error);
          }
        },

        googleLogin: async () => {
          try {
            if (!isProduction()) {
              await handleDebugLogin();
              // 디버그 로그인 성공 시 자동 갱신 시작
              get().startAutoRefresh();
              return;
            }

            const googleUrl = await authService.getGoogleLoginUrl();
            window.location.href = googleUrl;
          } catch (error) {
            console.error('Google login failed:', error);
          }
        },

        logout: () => {
          // 로그아웃 시 자동 갱신 중지
          get().stopAutoRefresh();
          set({ user: null, token: null, refreshToken: null });
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
