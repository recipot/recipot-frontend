'use client';

import { cn } from '@/lib/utils';

import { TOTAL_STEPS } from '../_constants';

interface ABStepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

/**
 * A/B 테스트 B안 스텝 인디케이터
 * 3개의 점으로 현재 진행 단계를 표시합니다.
 * 각 dot 클릭 시 해당 스텝으로 이동할 수 있습니다.
 */
export default function ABStepIndicator({
  currentStep,
  onStepClick,
}: ABStepIndicatorProps) {
  const handleStepClick = (step: number) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;

        return (
          <button
            type="button"
            key={stepNumber}
            className={cn(
              'h-2 w-2 cursor-pointer rounded-[50%] border-none bg-gray-300 p-0 transition duration-300 ease-in-out active:bg-gray-900',
              isActive && 'bg-gray-900'
            )}
            aria-label={`Step ${stepNumber} ${isActive ? '(현재)' : ''}`}
            onClick={() => handleStepClick(stepNumber)}
          />
        );
      })}
    </div>
  );
}
