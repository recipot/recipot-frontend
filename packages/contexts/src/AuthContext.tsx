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
      const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'production';
      const isDev = APP_ENV === 'development';

      if (isDev && !mswReady) {
        return; // MSW가 준비되지 않았으면 대기
      }

      console.info('🔄 인증 상태 초기화 중...');

      // LocalStorage에서 토큰 확인
      const storedToken = localStorage.getItem('authToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedToken) {
        console.info('✅ LocalStorage에서 토큰 발견');
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);

        try {
          // 토큰으로 사용자 정보 조회
          const userInfo = await authService.getUserInfo();
          console.info('✅ 사용자 정보 조회 성공:', userInfo);
          setUser(userInfo);
        } catch (error) {
          console.error('❌ 토큰이 유효하지 않음, 로그아웃 처리');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setToken(null);
          setRefreshToken(null);
        }
      } else {
        console.info('ℹ️ 저장된 토큰 없음 (로그인 필요)');
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

  const logout = async () => {
    console.info('🔄 로그아웃 처리 중...');

    // LocalStorage에서 토큰 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // 프론트엔드 상태 초기화
    setUser(null);
    setToken(null);
    setRefreshToken(null);

    // 백엔드 로그아웃 API 호출 (선택사항)
    try {
      await authService.logout();
      console.info('✅ 로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 API 실패 (무시):', error);
      // LocalStorage는 이미 삭제되었으므로 에러 무시
    }
  };

  // 토큰 자동 갱신
  const refreshAuth = async () => {
    const currentRefreshToken =
      refreshToken ?? localStorage.getItem('refreshToken');

    if (!currentRefreshToken) {
      console.error('❌ refresh token 없음');
      logout();
      return;
    }

    try {
      console.info('🔄 토큰 갱신 중...');
      const newTokenData = await authService.refreshToken(currentRefreshToken);

      // 새 토큰 저장
      localStorage.setItem('authToken', newTokenData.accessToken);
      if (newTokenData.refreshToken) {
        localStorage.setItem('refreshToken', newTokenData.refreshToken);
      }

      setToken(newTokenData.accessToken);
      setRefreshToken(newTokenData.refreshToken ?? currentRefreshToken);

      console.info('✅ 토큰 갱신 성공');

      // 사용자 정보 다시 조회
      const userInfo = await authService.getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error('❌ 토큰 갱신 실패:', error);
      logout();
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
