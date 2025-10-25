import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../../api/src';
import { UserInfo } from '../../types/src/auth.types';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;

  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: () => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  verifyAndRefreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

const isProduction = () =>
  process.env.NEXT_PUBLIC_APP_ENV !== 'development' &&
  process.env.NEXT_PUBLIC_APP_ENV !== 'local';

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

      return {
        user: null,
        token: null,
        refreshToken: null,
        loading: true,

        setUser: (user: UserInfo | null) => set({ user }),
        setToken: (token: string | null) => set({ token }),
        setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
        setLoading: (loading: boolean) => set({ loading }),

        verifyAndRefreshToken: async () => {
          const { token } = get();

          if (!token) {
            get().logout();
            return false;
          }

          try {
            // 토큰 검증 API 호출 - 만료 시 axios 인터셉터가 자동으로 재발급 처리
            await authService.verifyToken(token);
            return true;
          } catch (error) {
            // axios 인터셉터에서 재발급을 시도했지만 실패한 경우 (예: refreshToken도 만료)
            get().logout();
            return false;
          }
        },

        initializeAuth: async () => {
          set({ loading: true });

          const { token, user } = get();

          if (!token) {
            set({ loading: false });
            return;
          }

          if (user) {
            set({ loading: false });
            return;
          }

          try {
            const userInfo = await authService.getUserInfo();
            set({ user: userInfo });
          } catch (error) {
            console.error('Failed to fetch user info:', error);
          }

          set({ loading: false });
        },

        login: async () => {
          try {
            if (!isProduction()) {
              await handleDebugLogin();
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
              return;
            }

            const googleUrl = await authService.getGoogleLoginUrl();
            window.location.href = googleUrl;
          } catch (error) {
            console.error('Google login failed:', error);
          }
        },

        logout: () => {
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
