'use client';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

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
  onNextStep,
  onPrevStep,
  onStepComplete,
}: CookingOrderFooterProps) {
  const buttonTextClassName = 'text-17sb';
  const buttonLayoutClassName = 'flex-1 rounded-[100px] px-8 py-[15px]';
  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 transform bg-[#FFFFFF]/50">
      <div className="bg-white/50 px-4 py-4 backdrop-blur-sm">
        {isLastStep ? (
          <Button
            onClick={onStepComplete}
            className="bg-primary w-full rounded-full py-3 text-white"
          >
            <p className={buttonTextClassName}>해먹기 완료!</p>
          </Button>
        ) : isFirstStep ? (
          <Button
            onClick={onNextStep}
            className="bg-primary w-full rounded-full py-3 text-white"
          >
            <p className={buttonTextClassName}>다음으로</p>
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button
              onClick={onPrevStep}
              className={cn('bg-gray-600', buttonLayoutClassName)}
            >
              <p className={buttonTextClassName}>이전으로</p>
            </Button>
            <Button
              onClick={onNextStep}
              className={cn('bg-primary', buttonLayoutClassName)}
            >
              <p className={buttonTextClassName}>다음으로</p>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
