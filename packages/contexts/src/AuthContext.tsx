import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../../api/src';
import { AuthResponse, UserInfo } from '../../types/src/auth.types';
import { useMsw } from './MswContext';

// AuthContext 타입 정의
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
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { mswReady } = useMsw();

  useEffect(() => {
    const initializeAuth = async () => {
      // 개발 환경에서는 MSW가 준비될 때까지 대기
      if (process.env.NODE_ENV === 'development' && !mswReady) {
        return; // MSW가 준비되지 않았으면 대기
      }

      // 페이지 로드 시 저장된 토큰 확인
      const savedToken = localStorage.getItem('authToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');

      if (savedToken) {
        try {
          const userData = await authService.verifyToken(savedToken);
          setUser(userData.data as UserInfo);
          setToken(savedToken);
          if (savedRefreshToken) {
            setRefreshToken(savedRefreshToken);
          }
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [mswReady]);

  const login = async () => {
    try {
      // 카카오 로그인 URL 생성
      const kakaoUrl = await authService.getKakaoLoginUrl();
      console.log('kakaoUrl', kakaoUrl);

      // 카카오 인증 페이지로 리디렉션
      window.location.href = kakaoUrl;
    } catch (error) {
      console.error('카카오 로그인 URL 생성 실패:', error);
    }
  };

  const googleLogin = async () => {
    try {
      // 구글 로그인 URL 생성
      const googleUrl = await authService.getGoogleLoginUrl();

      // 구글 인증 페이지로 리디렉션
      window.location.href = googleUrl;
    } catch (error) {
      console.error('구글 로그인 URL 생성 실패:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  // 토큰 자동 갱신
  const refreshAuth = async () => {
    if (refreshToken) {
      try {
        const newTokenData = await authService.refreshToken(refreshToken);
        setToken(newTokenData.accessToken);
        setRefreshToken(newTokenData.refreshToken);
        localStorage.setItem('authToken', newTokenData.accessToken);
        localStorage.setItem('refreshToken', newTokenData.refreshToken);
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
        refreshToken,
        loading,
        login,
        googleLogin,
        logout,
        refreshAuth,
        setUser,
        setToken,
        setRefreshToken,
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
