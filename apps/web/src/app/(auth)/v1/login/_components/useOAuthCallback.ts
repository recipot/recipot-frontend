import { useCallback, useEffect, useState } from 'react';
import { authService } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter, useSearchParams } from 'next/navigation';

import type { UserInfo } from '@recipot/types';

/**
 * 온보딩 완료 상태를 안전하게 확인하는 함수
 * @param isOnboardingCompleted - 온보딩 완료 상태 (boolean | undefined)
 * @returns true인 경우에만 true, 그 외 모든 경우 false
 */
// const isOnboardingComplete = (
//   isOnboardingCompleted: boolean | undefined
// ): boolean => {
//   return isOnboardingCompleted === true;
// };

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

  // 페이지 이동 로직 분리
  const navigateWithDelay = useCallback(
    (delay: number = 1000) => {
      setTimeout(() => {
        router.push('/');
        // 사용자 정보가 설정된 후 온보딩 상태에 따라 리다이렉트
        // if (isOnboardingComplete(user?.isOnboardingCompleted)) {
        // } else {
        //   router.push('/onboarding');
        // }
      }, delay);
    },
    [router]
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
      // 사용자 정보 설정 후 온보딩 상태에 따라 리다이렉트
      router.push('/');
      // setTimeout(() => {
      //   if (isOnboardingComplete(user.isOnboardingCompleted)) {
      //   } else {
      //     router.push('/onboarding');
      //   }
      // }, 1000);
    },
    [setUser, router]
  );

  // 에러 처리 로직 분리
  const handleError = useCallback(
    (error: unknown, context: string) => {
      console.error(`${context}:`, error);
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

  // 백엔드에서 userId를 받아 토큰 정보 조회 (LocalStorage 방식)
  const handleBackendUserIdWithToken = useCallback(
    async (userId: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 로그인 정보를 가져오는 중...`
        );

        console.info(`🔍 [${provider}] userId로 토큰 조회:`, userId);
        console.info(`📡 [${provider}] API 호출: /v1/auth/info/${userId}`);

        const tokenData = await authService.getTokenByUserId(Number(userId));

        console.info(`✅ [${provider}] 토큰 조회 성공!`);
        console.info(
          `🔑 [${provider}] Access Token:`,
          `${tokenData.accessToken.substring(0, 20)}...`
        );
        console.info(`👤 [${provider}] 사용자 정보:`, tokenData.user);

        saveTokens(tokenData.accessToken, tokenData.refreshToken);
        setupUser(tokenData.user);
      } catch (error) {
        console.error(`❌ [${provider}] 토큰 조회 실패:`, error);
        handleError(
          error,
          `${provider === 'google' ? '구글' : '카카오'} 로그인 정보 조회 실패`
        );
      }
    },
    [provider, saveTokens, setupUser, handleError]
  );

  // 쿼리 파라미터로 받은 토큰 처리 (개발 환경)
  const handleTokensFromQuery = useCallback(
    async (accessToken: string, refreshToken: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 중...`
        );

        console.info(`✅ [${provider}] 쿼리에서 토큰 수신 (개발 환경)`);
        console.info(`💾 LocalStorage에 토큰 저장 중...`);

        // LocalStorage에 토큰 저장
        saveTokens(accessToken, refreshToken);

        console.info(`📡 사용자 정보 조회 중...`);

        // 사용자 정보 조회
        const userInfo = await authService.getUserInfo();

        console.info(`✅ [${provider}] 사용자 정보 조회 성공:`, userInfo);
        console.info(
          `🎉 [${provider}] 로그인 완료! (LocalStorage + 토큰 직접 전달)`
        );

        setupUser(userInfo);
      } catch (error) {
        console.error(`❌ [${provider}] 토큰 처리 실패:`, error);
        handleError(
          error,
          `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 실패`
        );
      }
    },
    [provider, saveTokens, setupUser, handleError]
  );

  // 백엔드에서 userId를 받아 사용자 정보 조회 (httpOnly 쿠키 방식)
  const handleBackendUserId = useCallback(
    async (userId: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 사용자 정보를 가져오는 중...`
        );

        console.info(`✅ [${provider}] 사용자 ID 수신:`, userId);
        console.info(`🍪 [${provider}] httpOnly 쿠키 방식으로 인증 처리 중...`);

        // /v1/users/profile/me API 호출 (쿠키가 자동으로 전송됨)
        const userInfo = await authService.getUserInfo();

        console.info(`✅ [${provider}] 사용자 정보 조회 성공:`, userInfo);
        console.info(`🎉 [${provider}] 로그인 완료! (httpOnly 쿠키 인증)`);

        setupUser(userInfo);
      } catch (error) {
        console.error(`❌ [${provider}] 사용자 정보 조회 실패:`, error);
        handleError(
          error,
          `${provider === 'google' ? '구글' : '카카오'} 로그인 처리 실패`
        );
      }
    },
    [provider, setupUser, handleError]
  );

  // 기존 인가코드 처리 (구글 등 다른 제공자용 유지)
  const handleAuthCode = useCallback(
    async (code: string) => {
      try {
        setStatus(
          `${provider === 'google' ? '구글' : '카카오'} 인증을 처리하는 중...`
        );

        console.info(
          `${provider} 인증 코드로 토큰 요청:`,
          `${code.substring(0, 20)}...`
        );

        const tokenData =
          provider === 'google'
            ? await authService.getTokenFromGoogleCallback(code)
            : await authService.completeKakaoLogin(code);

        console.info(`${provider} 토큰 응답:`, tokenData);

        saveTokens(tokenData.accessToken, tokenData.refreshToken);
        setupUser(tokenData.user);
      } catch (error) {
        handleError(
          error,
          `${provider === 'google' ? '구글' : '카카오'} 인증 코드 처리 실패`
        );
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

    console.info(`🔄 [${provider}] 콜백 처리 시작`);
    console.info(`📝 [${provider}] 파라미터:`, {
      hasAccessToken: !!accessToken,
      hasCode: !!code,
      hasError: !!error,
      hasRefreshToken: !!refreshToken,
      hasToken: !!token,
      hasUserId: !!userId,
    });

    if (error) {
      console.error(`❌ [${provider}] 로그인 에러:`, error);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 로그인에 실패했습니다.`
      );
      navigateWithDelay(2000);
      return;
    }

    // 우선순위 1: 백엔드가 토큰을 직접 전달 (개발 환경)
    if (userId && accessToken) {
      console.info(`✅ [${provider}] 토큰 직접 전달 방식 (개발 환경)`);
      console.info(`   - userId: ${userId}`);
      console.info(`   - accessToken: ${accessToken.substring(0, 20)}...`);
      if (refreshToken) {
        console.info(`   - refreshToken: ${refreshToken.substring(0, 20)}...`);
      }

      // LocalStorage에 토큰 저장
      handleTokensFromQuery(accessToken, refreshToken ?? '');
    } else if (userId) {
      // 우선순위 2: userId만 받음 (기존 방식 - fallback)
      console.info(`✅ [${provider}] userId 방식 - 사용자 ID 수신:`, userId);
      console.info('→ /v1/auth/info/{userId}로 토큰 받기');

      // userId로 토큰 받아서 LocalStorage 저장
      handleBackendUserIdWithToken(userId);
    } else if (token) {
      // 백엔드에서 JWT 토큰을 쿼리 파라미터로 전달받는 경우 (직접 토큰 방식)
      console.info(
        `✅ [${provider}] token 방식 - 백엔드 토큰 수신:`,
        `${token.substring(0, 20)}...`
      );
      handleTokenReceived(token);
    } else if (code) {
      // OAuth에서 받은 인증 코드를 백엔드로 전달 (기존 방식 - 구글 등)
      console.info(
        `✅ [${provider}] code 방식 - 인가코드 수신:`,
        `${code.substring(0, 20)}...`
      );
      handleAuthCode(code);
    } else {
      console.error(`❌ [${provider}] 필요한 파라미터를 찾을 수 없습니다.`);
      setStatus(
        `${provider === 'google' ? '구글' : '카카오'} 인증 정보를 찾을 수 없습니다.`
      );
      navigateWithDelay(2000);
    }
  }, [
    searchParams,
    handleAuthCode,
    handleBackendUserId,
    handleBackendUserIdWithToken,
    handleTokenReceived,
    handleTokensFromQuery,
    provider,
    navigateWithDelay,
  ]);

  return { status };
}
