import { useCallback, useEffect, useState } from 'react';
import { authService } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { getCookie } from '@recipot/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { isProduction } from '@/lib/env';

import type { UserInfo } from '@recipot/types';

export type OAuthProvider = 'google' | 'kakao';

interface UseOAuthCallbackProps {
  provider: OAuthProvider;
}

const getProviderName = (provider: OAuthProvider): string => {
  return provider === 'google' ? '구글' : '카카오';
};

export function useOAuthCallback({ provider }: UseOAuthCallbackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRefreshToken, setToken, setUser } = useAuth();
  const useCookieAuth = isProduction;
  const [status, setStatus] = useState(
    `${getProviderName(provider)} 로그인 처리 중...`
  );

  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      if (useCookieAuth) {
        // 프로덕션 쿠키 기반 인증에서는 토큰을 직접 저장하지 않음
        setToken(null);
        setRefreshToken(null);
        return;
      }

      setToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setToken, setRefreshToken, useCookieAuth]
  );

  const navigateAfterLogin = useCallback(
    (user: UserInfo) => {
      setUser(user);
      const destination = user.isFirstEntry ? '/onboarding' : '/';
      router.push(destination);
    },
    [setUser, router]
  );

  const handleError = useCallback(
    (error: unknown) => {
      console.error(`[${provider}] OAuth error:`, error);
      setStatus(
        `${getProviderName(provider)} 로그인 처리 중 오류가 발생했습니다.`
      );
      setTimeout(() => router.push('/'), 2000);
    },
    [provider, router]
  );

  const handleAuthCode = useCallback(
    async (code: string) => {
      try {
        setStatus(`${getProviderName(provider)} 인증을 처리하는 중...`);

        const tokenData =
          provider === 'google'
            ? await authService.getTokenFromGoogleCallback(code)
            : await authService.completeKakaoLogin(code);

        saveTokens(tokenData.accessToken, tokenData.refreshToken);
        navigateAfterLogin(tokenData.user);
      } catch (error) {
        handleError(error);
      }
    },
    [provider, saveTokens, navigateAfterLogin, handleError]
  );

  const handleTokensFromQuery = useCallback(
    async (accessToken: string, refreshToken: string) => {
      try {
        setStatus(`${getProviderName(provider)} 로그인 처리 중...`);

        saveTokens(accessToken, refreshToken);
        const userInfo = await authService.getUserInfo();
        navigateAfterLogin(userInfo);
      } catch (error) {
        handleError(error);
      }
    },
    [provider, saveTokens, navigateAfterLogin, handleError]
  );

  const handleTokenFromCookie = useCallback(async () => {
    if (useCookieAuth) {
      try {
        setStatus(`${getProviderName(provider)} 사용자 정보를 가져오는 중...`);

        const userInfo = await authService.getUserInfo();
        navigateAfterLogin(userInfo);
      } catch (error) {
        handleError(error);
      }
      return;
    }

    try {
      setStatus(`${getProviderName(provider)} 사용자 정보를 가져오는 중...`);

      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');

      if (!accessToken) {
        throw new Error('No access token in cookie');
      }

      saveTokens(accessToken, refreshToken ?? '');
      const userInfo = await authService.getUserInfo();
      navigateAfterLogin(userInfo);
    } catch (error) {
      handleError(error);
    }
  }, [provider, useCookieAuth, navigateAfterLogin, handleError, saveTokens]);

  const handleTokenVerification = useCallback(
    async (token: string) => {
      try {
        setStatus('사용자 정보를 확인하는 중...');

        const userResponse = await authService.verifyToken(token);
        if (!userResponse?.success || !userResponse?.data) {
          throw new Error('Token verification failed');
        }

        saveTokens(token, `temp_refresh_${Date.now()}`);
        navigateAfterLogin(userResponse.data);
      } catch (error) {
        handleError(error);
      }
    },
    [saveTokens, navigateAfterLogin, handleError]
  );

  useEffect(() => {
    const code = searchParams.get('code');
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error(`[${provider}] OAuth error from query:`, error);
      setStatus(`${getProviderName(provider)} 로그인에 실패했습니다.`);
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    if (userId && accessToken) {
      handleTokensFromQuery(accessToken, refreshToken ?? '');
    } else if (userId) {
      handleTokenFromCookie();
    } else if (token) {
      handleTokenVerification(token);
    } else if (code) {
      handleAuthCode(code);
    } else {
      setStatus(`${getProviderName(provider)} 인증 정보를 찾을 수 없습니다.`);
      setTimeout(() => router.push('/'), 2000);
    }
  }, [
    searchParams,
    provider,
    router,
    handleAuthCode,
    handleTokenFromCookie,
    handleTokenVerification,
    handleTokensFromQuery,
  ]);

  return { status };
}
