import { useCallback, useEffect, useState } from 'react';
import { authService } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter, useSearchParams } from 'next/navigation';

import type { UserInfo } from '@recipot/types';

export type OAuthProvider = 'google' | 'kakao';

interface UseOAuthCallbackProps {
  provider: OAuthProvider;
}

export function useOAuthCallback({ provider }: UseOAuthCallbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRefreshToken, setToken, setUser } = useAuth();
  const [status, setStatus] = useState(
    `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 중...`
  );

  // 토큰 저장 로직 분리
  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setToken, setRefreshToken]
  );

  // 사용자 설정 로직 분리
  const setupUser = useCallback(
    (user: UserInfo) => {
      setUser(user);
    },
    [setUser]
  );

  // 성공 처리 로직 분리
  const handleSuccess = useCallback(() => {
    setStatus('로그인 성공! 메인 페이지로 이동합니다...');
    setTimeout(() => router.push('/'), 1000);
  }, [router]);

  // 에러 처리 로직 분리
  const handleError = useCallback(
    (error: unknown, context: string) => {
      console.error(`${context}:`, error);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 중 오류가 발생했습니다.`
      );
      setTimeout(() => router.push('/'), 2000);
    },
    [provider, router]
  );

  const handleTokenReceived = useCallback(
    async (token: string) => {
      try {
        setStatus('사용자 정보를 확인하는 중...');

        const userResponse = await authService.verifyToken(token);
        if (!userResponse.success || !userResponse.data) {
          throw new Error('사용자 정보 조회 실패');
        }

        saveTokens(token, `temp_refresh_${Date.now()}`);
        setupUser(userResponse.data);
        handleSuccess();
      } catch (error) {
        handleError(error, '토큰 처리 실패');
      }
    },
    [saveTokens, setupUser, handleSuccess, handleError]
  );

  const handleAuthCode = useCallback(
    async (code: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 인증을 처리하는 중...`
        );

        const tokenData =
          provider === 'google'
            ? await authService.getTokenFromGoogleCallback(code)
            : await authService.getTokenFromCallback(code);

        const { accessToken, refreshToken, user } = tokenData;
        saveTokens(accessToken, refreshToken);
        setupUser(user);
        handleSuccess();
      } catch (error) {
        handleError(
          error,
          `${provider === 'google' ? '구글' : '카카오'} 인증 코드 처리 실패`
        );
      }
    },
    [provider, saveTokens, setupUser, handleSuccess, handleError]
  );

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 로그인에 실패했습니다.`
      );
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    if (process.env.NODE_ENV === 'development' && token) {
      // 백엔드에서 JWT 토큰을 쿼리 파라미터로 전달받는 경우 (테스트용)
      handleTokenReceived(token);
    } else if (code) {
      // OAuth에서 받은 인증 코드를 백엔드로 전달 (실제 플로우)
      handleAuthCode(code);
    } else {
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 인증 정보를 찾을 수 없습니다.`
      );
      setTimeout(() => router.push('/'), 2000);
    }
  }, [searchParams, router, handleAuthCode, handleTokenReceived, provider]);

  return { status };
}
