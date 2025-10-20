'use client';

import { useEffect, useState } from 'react';
import { AuthProvider, MswProvider } from '@recipot/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mswReady, setMswReady] = useState(
    process.env.NODE_ENV !== 'development'
  );

  // 개발 환경에서만 MSW 워커 시작
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser')
        .then(({ startMswWorker }) => {
          return startMswWorker();
        })
        .then(() => {
          console.info('🚀 MSW가 준비되었습니다');
          setMswReady(true);
        })
        .catch(error => {
          console.error('MSW 초기화 실패:', error);
          setMswReady(true); // 에러가 있어도 앱은 계속 실행
        });
    }
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
    <QueryClientProvider client={queryClient}>
      <MswProvider mswReady={mswReady}>
        <AuthProvider>{children}</AuthProvider>
      </MswProvider>
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
