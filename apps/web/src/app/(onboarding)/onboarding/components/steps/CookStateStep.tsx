'use client';

import { Button } from '@/components/common/Button';

import { useOnboarding } from '../../context/OnboardingContext';

export default function CookStateStep() {
  const { goToNextStep, markStepCompleted, setStepData } = useOnboarding();

  const handleNext = () => {
    // TODO: 실제 요리 상태 데이터 수집 로직 구현
    const cookStateData = {
      /* 요리 상태 데이터 */
    };
    setStepData(2, cookStateData);
    markStepCompleted(2);
    goToNextStep();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">요리할 여유가 얼마나 있나요?</h1>
      <p className="mb-8 text-gray-600">상태와 재료 딱 두 가지만 알려주세요!</p>

      {/* TODO: 실제 요리 상태 선택 UI 구현 */}
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <p>요리 상태 선택 UI가 여기에 들어갑니다</p>
        </div>
      </div>

      <div className="mt-8">
        <Button size="full" onClick={handleNext}>
          다음 단계
        </Button>
      </div>
    </div>
  );
}
