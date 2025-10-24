import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { UserInfo } from '../../types/src/auth.types';
import { useMsw } from './MswContext';
import { useAuthStore } from './authStore';

// AuthContext 타입 정의 (Zustand store를 그대로 사용)
interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: () => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: any }) {
  const { mswReady } = useMsw();
  const authStore = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      // 개발 환경에서는 MSW가 준비될 때까지 대기
      const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
      const isLocal = APP_ENV === 'local';

      if (isLocal && !mswReady) {
        return; // MSW가 준비되지 않았으면 대기
      }

      // Zustand store의 초기화 로직 실행 (한 번만)
      await useAuthStore.getState().initializeAuth();
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mswReady]); // authStore 제거 (Zustand store는 고정 참조)

  // AuthContext는 Zustand store를 래핑만 함
  const contextValue: AuthContextType = {
    user: authStore.user,
    token: authStore.token,
    refreshToken: authStore.refreshToken,
    loading: authStore.loading,
    login: authStore.login,
    googleLogin: authStore.googleLogin,
    logout: authStore.logout,
    refreshAuth: async () => {
      await authStore.verifyAndRefreshToken();
    },
    setUser: authStore.setUser,
    setToken: authStore.setToken,
    setRefreshToken: authStore.setRefreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};
