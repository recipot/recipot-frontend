'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  // MSW는 Next.js API Routes로 대체됨
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     import('@/mocks/browser').then(({ startMswWorker }) => {
  //       startMswWorker();
  //     });
  //   }
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
