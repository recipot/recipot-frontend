'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * 온보딩 레이아웃
 * Suspense로 감싸서 클라이언트 컴포넌트 사용을 지원합니다.
 */
export default function OnboardingLayout({
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
