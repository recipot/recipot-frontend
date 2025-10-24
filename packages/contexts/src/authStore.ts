// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../../api/src';
import { UserInfo } from '../../types/src/auth.types';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;

  // Actions
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

      // 토큰 검증 및 갱신
      verifyAndRefreshToken: async () => {
        const { token, refreshToken } = get();

        if (!token) {
          console.warn('⚠️ 토큰이 없습니다.');
          return false;
        }

        try {
          // 1. 토큰 검증
          console.info('🔍 토큰 검증 중...');
          await authService.verifyToken(token);
          console.info('✅ 토큰 유효함');
          return true;
        } catch (error) {
          console.warn('⚠️ 토큰 만료됨, 갱신 시도 중...');

          // 2. 토큰 갱신 시도
          if (!refreshToken) {
            console.error('❌ Refresh token 없음');
            get().logout();
            return false;
          }

          try {
            const newTokenData = await authService.refreshToken(refreshToken);

            set({
              token: newTokenData.accessToken,
              refreshToken: newTokenData.refreshToken ?? refreshToken,
            });

            console.info('✅ 토큰 갱신 성공');
            return true;
          } catch (refreshError) {
            console.error('❌ 토큰 갱신 실패:', refreshError);
            get().logout();
            return false;
          }
        }
      },

      // 인증 초기화 (앱 시작 시)
      initializeAuth: async () => {
        set({ loading: true });

        const { token, user } = get();

        if (!token) {
          console.info('ℹ️ 저장된 토큰 없음 (로그인 필요)');
          set({ loading: false });
          return;
        }

        console.info('🔄 인증 상태 초기화 중...');
        console.info('📦 저장된 상태:', {
          hasToken: !!token,
          hasUser: !!user,
          userId: user?.id
        });

        // 사용자 정보가 이미 있으면 검증 스킵 (persist에서 복원됨)
        if (user) {
          console.info('✅ 사용자 정보가 이미 있음, 검증 스킵');
          set({ loading: false });
          return;
        }

        // 사용자 정보가 없으면 API로 조회
        try {
          console.info('🔍 사용자 정보 조회 중...');
          const userInfo = await authService.getUserInfo();
          console.info('✅ 사용자 정보 조회 성공:', userInfo);
          set({ user: userInfo });
        } catch (error) {
          console.error('❌ 사용자 정보 조회 실패:', error);
          // 실패해도 바로 logout하지 않음 (토큰은 유지)
          // 실제 API 호출 시 401이 나면 axios interceptor가 처리
          console.warn('⚠️ 사용자 정보 조회 실패했지만 토큰은 유지합니다');
        }

        set({ loading: false });
      },

      // 카카오 로그인
      login: async () => {
        const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';

        try {
          // development 환경: 디버그 토큰으로 로그인
          if (APP_ENV === 'development') {
            console.info('🔧 [development] 디버그 토큰으로 로그인 중...');

            const tokenData = await authService.getDebugToken(1, 'U01001');

            set({
              token: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              user: tokenData.user,
            });

            console.info('✅ [development] 디버그 로그인 성공');
            return;
          }

          // production 환경: 실제 카카오 OAuth 로그인
          console.info('🔐 [production] 카카오 OAuth 로그인 시작');
          const kakaoUrl = await authService.getKakaoLoginUrl();
          window.location.href = kakaoUrl;
        } catch (error) {
          console.error('카카오 로그인 실패:', error);
        }
      },

      // 구글 로그인
      googleLogin: async () => {
        const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';

        try {
          // development 환경: 디버그 토큰으로 로그인
          if (APP_ENV === 'development') {
            console.info('🔧 [development] 디버그 토큰으로 로그인 중...');

            const tokenData = await authService.getDebugToken(1, 'U01001');

            set({
              token: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              user: tokenData.user,
            });

            console.info('✅ [development] 디버그 로그인 성공');
            return;
          }

          // production 환경: 실제 구글 OAuth 로그인
          console.info('🔐 [production] 구글 OAuth 로그인 시작');
          const googleUrl = await authService.getGoogleLoginUrl();
          window.location.href = googleUrl;
        } catch (error) {
          console.error('구글 로그인 실패:', error);
        }
      },

      // 로그아웃
      logout: () => {
        console.info('🔄 로그아웃 처리 중...');
        set({
          user: null,
          token: null,
          refreshToken: null,
        });
        console.info('✅ 로그아웃 성공');
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key
      partialize: state => ({
        // LocalStorage에 저장할 항목만 선택
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        // loading은 저장하지 않음 (항상 초기화됨)
      }),
    }
  )
);
