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

  const navigateWithDelay = useCallback(
    (delay: number = 1000) => {
      setTimeout(() => {
        router.push('/');
      }, delay);
    },
    [router]
  );

  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setToken, setRefreshToken]
  );

  const setupUser = useCallback(
    (user: UserInfo) => {
      setUser(user);

      // isFirstEntry가 true이면 온보딩이 필요한 사용자
      if (user.isFirstEntry) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    },
    [setUser, router]
  );

  const handleError = useCallback(
    (error: unknown, context: string) => {
      console.error(`[${provider}] ${context}:`, error);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 중 오류가 발생했습니다.`
      );
      navigateWithDelay(2000);
    },
    [provider, navigateWithDelay]
  );

  const handleTokenReceived = useCallback(
    async (token: string) => {
      try {
        setStatus('사용자 정보를 확인하는 중...');

        const userResponse = await authService.verifyToken(token);
        if (!userResponse?.success || !userResponse?.data) {
          throw new Error('사용자 정보 조회 실패');
        }

        saveTokens(token, `temp_refresh_${Date.now()}`);
        setupUser(userResponse.data);
      } catch (error) {
        handleError(error, '토큰 처리 실패');
      }
    },
    [saveTokens, setupUser, handleError]
  );

  const handleTokensFromQuery = useCallback(
    async (accessToken: string, refreshToken: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 중...`
        );

        saveTokens(accessToken, refreshToken);
        const userInfo = await authService.getUserInfo();
        setupUser(userInfo);
      } catch (error) {
        handleError(error, '로그인 처리 실패');
      }
    },
    [provider, saveTokens, setupUser, handleError]
  );

  const handleBackendUserId = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_userId: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 사용자 정보를 가져오는 중...`
        );

        // 백엔드가 쿠키에 토큰을 설정했으므로
        // withCredentials: true로 쿠키가 자동으로 전송됨
        // LocalStorage 저장 불필요 - 쿠키가 더 안전함 (HttpOnly, SameSite)
        console.info('🍪 쿠키 기반 인증 사용 - 자동으로 전송됨');

        const userInfo = await authService.getUserInfo();
        setupUser(userInfo);
      } catch (error) {
        handleError(error, '로그인 처리 실패');
      }
    },
    [provider, setupUser, handleError]
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
            : await authService.completeKakaoLogin(code);

        saveTokens(tokenData.accessToken, tokenData.refreshToken);
        setupUser(tokenData.user);
      } catch (error) {
        handleError(error, '인증 코드 처리 실패');
      }
    },
    [provider, saveTokens, setupUser, handleError]
  );

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error(`[${provider}] 로그인 에러:`, error);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 로그인에 실패했습니다.`
      );
      navigateWithDelay(2000);
      return;
    }

    if (userId && accessToken) {
      handleTokensFromQuery(accessToken, refreshToken ?? '');
    } else if (userId) {
      // 백엔드가 쿠키에 토큰을 설정해서 리다이렉트한 경우
      // 쿠키의 토큰을 사용해서 사용자 정보를 조회
      handleBackendUserId(userId);
    } else if (token) {
      handleTokenReceived(token);
    } else if (code) {
      handleAuthCode(code);
    } else {
      console.error(`[${provider}] 필요한 파라미터를 찾을 수 없습니다.`);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 인증 정보를 찾을 수 없습니다.`
      );
      navigateWithDelay(2000);
    }
  }, [
    searchParams,
    handleAuthCode,
    handleBackendUserId,
    handleTokenReceived,
    handleTokensFromQuery,
    provider,
    navigateWithDelay,
  ]);

  return { status };
}
