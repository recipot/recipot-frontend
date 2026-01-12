'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import ABTestVariantA from './_components/ABTestVariantA';
import ABTestVariantB from './_components/ABTestVariantB';

/**
 * A/B 테스트 페이지
 * URL 파라미터 ?variant=A 또는 ?variant=B로 각각 다른 플로우를 실행합니다.
 * 로그인 없이도 컨디션 선택 → 재료 검색 → 레시피 추천을 진행할 수 있습니다.
 */
function ABTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant');

  // variant가 A 또는 B가 아니면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (variant !== 'A' && variant !== 'B') {
      router.replace('/');
    }
  }, [variant, router]);

  if (variant !== 'A' && variant !== 'B') {
    return null;
  }

  return (
    <div className="flex justify-center">
      {variant === 'A' ? <ABTestVariantA /> : <ABTestVariantB />}
    </div>
  );
}

export default function ABTestPage() {
  return (
    <Suspense fallback={null}>
      <ABTestContent />
    </Suspense>
  );
}
