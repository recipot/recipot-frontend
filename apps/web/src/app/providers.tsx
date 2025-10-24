'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, MswProvider } from '@recipot/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SplashScreen } from '@/components/common/SplashScreen';
import { SplashProvider } from '@/contexts/SplashContext';

import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

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
      const env = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
      console.info(`✅ [${env}] 실제 API를 사용합니다`);
    }
  }, [shouldUseMSW]);

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
        {/* {isDevelopment ? <ReactQueryDevtools initialIsOpen={false} /> : null} */}
      </QueryClientProvider>
    </SplashProvider>
  );
}
