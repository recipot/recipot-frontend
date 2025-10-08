'use client';

import { useCurrentStep } from '@/stores/onboardingStore';

/**
 * 온보딩 스텝 인디케이터
 */
export default function StepIndicator() {
  const currentStep = useCurrentStep();
  const totalSteps = 3;

  return (
    <div className="fixed top-14 right-0 left-0 z-10 flex w-full justify-center">
      <div className="flex w-full">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCurrentStep = currentStep === stepNumber;

          return (
            <div
              key={stepNumber}
              className={`h-1 flex-1 rounded-sm transition-all duration-300 ${
                isCurrentStep ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
