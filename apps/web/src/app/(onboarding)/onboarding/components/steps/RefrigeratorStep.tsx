'use client';

import { Button } from '@/components/common/Button';

import { useOnboarding } from '../../context/OnboardingContext';

export default function RefrigeratorStep() {
  const { markStepCompleted, setStepData } = useOnboarding();

  const handleComplete = () => {
    // TODO: 실제 냉장고 재료 데이터 수집 로직 구현
    const refrigeratorData = {
      /* 냉장고 재료 데이터 */
    };
    setStepData(3, refrigeratorData);
    markStepCompleted(3);

    // 온보딩 완료 처리
    console.log('온보딩 완료!', refrigeratorData);
    // TODO: 메인 페이지로 이동하거나 완료 처리
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">
        현재 냉장고에 어떤 재료를 가지고 계신가요?
      </h1>
      <p className="mb-8 text-gray-600">두 가지만 골라도 요리를 찾아드려요</p>

      {/* TODO: 실제 냉장고 재료 선택 UI 구현 */}
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <p>냉장고 재료 선택 UI가 여기에 들어갑니다</p>
        </div>
      </div>

      <div className="mt-8">
        <Button size="full" onClick={handleComplete}>
          완료하기
        </Button>
      </div>
    </div>
  );
}
