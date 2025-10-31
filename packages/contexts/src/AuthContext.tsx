import { createContext, useContext, useEffect, ReactNode } from 'react';
import { UserInfo } from '../../types/src/auth.types';
import { useMsw } from './MswContext';
import { useAuthStore } from './authStore';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: () => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { mswReady } = useMsw();
  const authStore = useAuthStore();
  const isLocal = process.env.NEXT_PUBLIC_APP_ENV === 'local';

  useEffect(() => {
    if (isLocal && !mswReady) return;

    useAuthStore.getState().initializeAuth();
  }, [mswReady, isLocal]);

  const contextValue: AuthContextType = {
    user: authStore.user,
    token: authStore.token,
    refreshToken: authStore.refreshToken,
    loading: authStore.loading,
    login: authStore.login,
    googleLogin: authStore.googleLogin,
    logout: authStore.logout,
    refreshAuth: authStore.verifyAndRefreshToken,
    setUser: authStore.setUser,
    setToken: authStore.setToken,
    setRefreshToken: authStore.setRefreshToken,
    startAutoRefresh: authStore.startAutoRefresh,
    stopAutoRefresh: authStore.stopAutoRefresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
