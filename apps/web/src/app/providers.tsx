'use client';

import '../utils/setupConsole';

import { useCallback, useEffect, useState } from 'react';
import { setApiErrorHandler } from '@recipot/api';
import { AuthProvider, MswProvider } from '@recipot/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { ApiErrorModal } from '@/components/common/ApiErrorModal';
import { SplashScreen } from '@/components/common/SplashScreen';
import { SplashProvider } from '@/contexts/SplashContext';
import { useMoodExpiry } from '@/hooks/useMoodExpiry';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
import { useMoodStore } from '@/stores/moodStore';

import type { ReactNode } from 'react';

const FATAL_STATUS_CODES = new Set<number>([401]);
const RECIPE_AUTO_REDIRECT_SESSION_KEY = 'recipe-recommend-auto-redirected';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const pathname = usePathname();
  const mood = useMoodStore(state => state.mood);
  const isRecommendationReady = useMoodStore(
    state => state.isRecommendationReady
  );

  const handleGlobalMoodExpired = useCallback(() => {
    if (pathname !== '/') {
      router.replace('/');
    }
  }, [pathname, router]);

  useMoodExpiry({
    autoRefresh: true,
    onExpire: handleGlobalMoodExpired,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!mood || !isRecommendationReady) {
      sessionStorage.removeItem(RECIPE_AUTO_REDIRECT_SESSION_KEY);
      return;
    }

    if (pathname === '/recipeRecommend') {
      sessionStorage.setItem(RECIPE_AUTO_REDIRECT_SESSION_KEY, 'true');
      return;
    }

    const hasRedirected =
      sessionStorage.getItem(RECIPE_AUTO_REDIRECT_SESSION_KEY) === 'true';

    if (hasRedirected) {
      return;
    }

    sessionStorage.setItem(RECIPE_AUTO_REDIRECT_SESSION_KEY, 'true');
    router.replace('/recipeRecommend');
  }, [isRecommendationReady, mood, pathname, router]);

  // MSW 활성화 조건: NEXT_PUBLIC_APP_ENV가 'local'일 때만 사용
  const shouldUseMSW = process.env.NEXT_PUBLIC_APP_ENV === 'local';

  const [mswReady, setMswReady] = useState(!shouldUseMSW);

  // 조건에 따라 MSW 워커 시작
  useEffect(() => {
    if (shouldUseMSW) {
      import('@/mocks/browser')
        .then(({ startMswWorker }) => {
          return startMswWorker();
        })
        .then(() => {
          console.info('🚀 [local] MSW가 준비되었습니다 (Mock API 사용)');
          setMswReady(true);
        })
        .catch(error => {
          console.error('❌ [local] MSW 초기화 실패:', error);
          setMswReady(true); // 에러가 있어도 앱은 계속 실행
        });
    } else {
      // 프로덕션에서는 로그 출력하지 않음 (setupConsole.ts에서 처리)
      const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
      if (env === 'development') {
        console.info(`✅ [${env}] 실제 API를 사용합니다`);
      }
    }
  }, [shouldUseMSW]);

  useEffect(() => {
    const handleApiError = (error: unknown) => {
      const { showError } = useApiErrorModalStore.getState();

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ERR_CANCELED'
      ) {
        return;
      }

      const axiosError = error as {
        code?: string | number;
        message?: string;
        response?: {
          status?: number;
          data?: {
            code?: string | number;
            errorCode?: string | number;
            message?: string;
            errorMessage?: string;
          };
        };
      };

      const responseData = axiosError.response?.data;
      const status = axiosError.response?.status;

      const errorCode =
        responseData?.code ??
        responseData?.errorCode ??
        axiosError.code ??
        null;

      const errorMessage =
        responseData?.message ??
        responseData?.errorMessage ??
        axiosError.message;

      const normalizedErrorCode =
        typeof errorCode === 'number'
          ? errorCode
          : typeof errorCode === 'string'
            ? Number.parseInt(errorCode, 10)
            : null;

      const isFatal =
        (status != null && FATAL_STATUS_CODES.has(status)) ||
        (normalizedErrorCode != null &&
          !Number.isNaN(normalizedErrorCode) &&
          FATAL_STATUS_CODES.has(normalizedErrorCode));

      showError({
        code: errorCode ?? undefined,
        isFatal,
        message: errorMessage,
      });
    };

    setApiErrorHandler(handleApiError);

    return () => {
      setApiErrorHandler(null);
    };
  }, []);

  // MSW가 준비되지 않았으면 로딩 표시
  if (!mswReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <p>Mock API 초기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <SplashProvider>
      <SplashScreen />
      <QueryClientProvider client={queryClient}>
        <MswProvider mswReady={mswReady}>
          <AuthProvider>{children}</AuthProvider>
        </MswProvider>
        <ApiErrorModal />
        {/* {isDevelopment ? <ReactQueryDevtools initialIsOpen={false} /> : null} */}
      </QueryClientProvider>
    </SplashProvider>
  );
}
