'use client';

import { Suspense } from 'react';

import ABTestVariantA from './_components/ABTestVariantA';

/**
 * A/B 테스트 페이지
 * URL 파라미터 ?variant=A 또는 ?variant=B로 각각 다른 플로우를 실행합니다.
 * 로그인 없이도 컨디션 선택 → 재료 검색 → 레시피 추천을 진행할 수 있습니다.
 */

export default function ABTestPage() {
  return (
    <Suspense fallback={null}>
      <ABTestVariantA />
    </Suspense>
  );
}
