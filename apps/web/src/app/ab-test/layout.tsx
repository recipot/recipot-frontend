'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A/B 테스트 레이아웃
 * Suspense로 감싸서 useSearchParams 사용을 지원합니다.
 */
export default function ABTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin" size={32} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
