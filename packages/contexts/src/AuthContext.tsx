import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../../api/src';
import { AuthResponse, UserInfo } from '../../types/src/auth.types';

// AuthContext 타입 정의
interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 페이지 로드 시 저장된 토큰 확인
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      authService
        .verifyToken(savedToken)
        .then((userData: AuthResponse) => {
          setUser(userData.data as UserInfo);
          setToken(savedToken);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = () => {
    // 백엔드 카카오 로그인 URL로 리디렉션
    window.location.href = authService.getKakaoLoginUrl();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };

  // 토큰 자동 갱신
  const refreshAuth = async () => {
    if (token) {
      try {
        const newTokenData = await authService.refreshToken(token);
        setToken(newTokenData.accessToken);
        localStorage.setItem('authToken', newTokenData.accessToken);
      } catch (error) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};
