'use client';

import { Button } from '@/components/common/Button';

interface CookingOrderFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onStepComplete: () => void;
}

export default function CookingOrderFooter({
  isFirstStep,
  isLastStep,
  onPrevStep,
  onNextStep,
  onStepComplete,
}: CookingOrderFooterProps) {
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 transform">
      {/* 그라데이션 오버레이 */}
      <div className="h-4 bg-gradient-to-t from-white/50 to-transparent" />

      {/* 버튼 */}
      <div className="bg-white/50 px-4 py-4 backdrop-blur-sm">
        {isFirstStep ? (
          <Button
            onClick={onStepComplete}
            className="bg-primary w-full rounded-full py-3 font-semibold text-white"
          >
            다음으로
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              onClick={onPrevStep}
              className="flex-1 rounded-full bg-gray-500 py-3 font-semibold text-white"
            >
              이전으로
            </Button>
            <Button
              onClick={isLastStep ? onStepComplete : onNextStep}
              className="bg-primary flex-1 rounded-full py-3 font-semibold text-white"
            >
              {isLastStep ? '완료' : '다음으로'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
