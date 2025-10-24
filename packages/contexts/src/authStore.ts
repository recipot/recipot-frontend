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

const isProduction = () => process.env.NEXT_PUBLIC_APP_ENV !== 'development';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: true,

      setUser: (user: UserInfo | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
      setLoading: (loading: boolean) => set({ loading }),

      verifyAndRefreshToken: async () => {
        const { token, refreshToken } = get();

        if (!token) return false;

        try {
          await authService.verifyToken(token);
          return true;
        } catch {
          if (!refreshToken) {
            get().logout();
            return false;
          }

          try {
            const newTokenData = await authService.refreshToken(refreshToken);
            set({
              token: newTokenData.accessToken,
              refreshToken: newTokenData.refreshToken ?? refreshToken,
            });
            return true;
          } catch {
            get().logout();
            return false;
          }
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
            const tokenData = await authService.getDebugToken(1, 'U01001');
            set({
              token: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              user: tokenData.user,
            });
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
            const tokenData = await authService.getDebugToken(1, 'U01001');
            set({
              token: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              user: tokenData.user,
            });
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
    }),
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
