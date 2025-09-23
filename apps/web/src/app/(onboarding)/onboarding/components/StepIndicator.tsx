'use client';

import { useOnboarding } from '../context/OnboardingContext';

export default function StepIndicator() {
  const { state } = useOnboarding();
  const totalSteps = 3;

  return (
    <div className="flex w-full justify-center px-6 py-4">
      <div className="flex w-full max-w-md gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCurrentStep = state.currentStep === stepNumber;

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
