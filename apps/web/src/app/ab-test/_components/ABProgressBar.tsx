'use client';

interface ABProgressBarProps {
  currentStep: number;
  totalSteps: number;
  /** true: 현재 스텝만 활성화 (A안), false: 현재+이전 스텝 활성화 (B안) */
  currentOnly?: boolean;
}

/**
 * A/B 테스트 진행률 바
 * 못 먹는 재료 페이지에서 사용되는 막대 형태의 진행률 표시기
 */
export default function ABProgressBar({
  currentOnly = false,
  currentStep,
  totalSteps,
}: ABProgressBarProps) {
  return (
    <div className="fixed top-14 right-0 left-0 z-10 flex w-full justify-center">
      <div className="flex w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = currentOnly
            ? stepNumber === currentStep
            : stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-1 flex-1 rounded-sm transition-all duration-300 ${
                isActive ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
