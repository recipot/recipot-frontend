
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';


export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  // 개발 환경에서만 MSW 워커 시작
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../mocks/browser').then(({ startMswWorker }) => {
        startMswWorker();
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}


