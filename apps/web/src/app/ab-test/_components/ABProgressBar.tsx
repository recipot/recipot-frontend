'use client';

interface ABProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * A/B 테스트 B안 진행률 바
 * 못 먹는 재료 페이지에서 사용되는 막대 형태의 진행률 표시기
 */
export default function ABProgressBar({
  currentStep,
  totalSteps,
}: ABProgressBarProps) {
  return (
    <div className="fixed top-14 right-0 left-0 z-10 flex w-full justify-center">
      <div className="flex w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-1 flex-1 rounded-sm transition-all duration-300 ${
                isCompleted ? 'bg-gray-900' : 'bg-gray-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
