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
      console.info('💾 토큰 저장 중...', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });

      // authStore에 저장 (Zustand persist가 자동으로 localStorage에 저장)
      setToken(accessToken);
      setRefreshToken(refreshToken);

      // Zustand persist가 비동기적으로 작동하므로
      // axios interceptor가 즉시 사용할 수 있도록 localStorage에도 직접 저장
      if (typeof window !== 'undefined') {
        const authStorage = {
          state: {
            token: accessToken,
            refreshToken: refreshToken,
            user: null, // user는 나중에 저장됨
          },
          version: 0,
        };
        localStorage.setItem('auth-storage', JSON.stringify(authStorage));
        console.info('✅ localStorage 직접 저장 완료');
      }
    },
    [setToken, setRefreshToken]
  );

  const setupUser = useCallback(
    (user: UserInfo) => {
      console.info('👤 사용자 정보 설정 중...', {
        userId: user.id,
        isFirstEntry: user.isFirstEntry
      });

      setUser(user);

      // localStorage의 user 정보도 업데이트
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            parsed.state.user = user;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
            console.info('✅ localStorage user 업데이트 완료');
          } catch (error) {
            console.error('localStorage user 업데이트 실패:', error);
          }
        }
      }

      // isFirstEntry가 true이면 온보딩이 필요한 사용자
      if (user.isFirstEntry) {
        console.info('🎯 온보딩 페이지로 이동');
        router.push('/onboarding');
      } else {
        console.info('🎯 메인 페이지로 이동');
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

        // 백엔드가 쿠키에 토큰을 설정했으므로 먼저 읽어서 LocalStorage에 저장
        // 그 다음 /v1/users/profile/me를 호출해서 사용자 정보 조회
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        console.info('🔍 [디버깅] 현재 모든 쿠키:', document.cookie);

        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');

        console.info(
          '🔍 [디버깅] accessToken:',
          accessToken ? `${accessToken.substring(0, 20)}...` : 'null'
        );
        console.info(
          '🔍 [디버깅] refreshToken:',
          refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'
        );

        if (accessToken) {
          console.info('🍪 쿠키에서 토큰 발견, LocalStorage에 저장');
          saveTokens(accessToken, refreshToken ?? '');
          console.info('💾 LocalStorage 저장 완료');
        } else {
          console.error('⚠️ 쿠키에 accessToken이 없습니다!');
          console.error('⚠️ 백엔드의 쿠키 Domain 설정을 확인하세요.');
        }

        // 토큰으로 사용자 정보 조회
        const userInfo = await authService.getUserInfo();
        setupUser(userInfo);
      } catch (error) {
        console.error('❌ 사용자 정보 조회 실패:', error);
        handleError(error, '로그인 처리 실패');
      }
    },
    [provider, saveTokens, setupUser, handleError]
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
