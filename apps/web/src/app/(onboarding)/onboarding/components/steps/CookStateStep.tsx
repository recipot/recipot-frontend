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
      {/* TODO: 실제 요리 상태 선택 UI 구현 */}
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <p>요리 상태 선택 UI가 여기에 들어갑니다</p>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button onClick={handleNext}>여유에 맞는 요리 추천받기</Button>
      </div>
    </div>
  );
}
