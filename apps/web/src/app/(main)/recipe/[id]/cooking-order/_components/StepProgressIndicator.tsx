'use client';

import type { CookingStep } from '@/types/recipe.types';

interface StepProgressIndicatorProps {
  steps: CookingStep[];
  currentStep: number;
}

export default function StepProgressIndicator({
  currentStep,
  steps,
}: StepProgressIndicatorProps) {
  return (
    <div className="mb-6 flex flex-col items-center">
      {/* 원형 인디케이터 */}
      <div className="mb-2 flex items-center justify-center">
        {steps.map((_: CookingStep, index: number) => (
          <div key={index} className="mt-[91px] flex items-center">
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                index < currentStep - 1
                  ? 'border-primary'
                  : index === currentStep - 1
                    ? 'border-primary'
                    : 'border-gray-300'
              }`}
            >
              {index < currentStep - 1 && (
                <div className="bg-primary h-2 w-2 rounded-full" />
              )}
              {index === currentStep - 1 && (
                <div className="bg-primary h-2 w-2 rounded-full" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="mr-[2px] ml-[2px] h-0.5 w-12 bg-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* 순서 라벨 */}
      <div className="flex justify-center">
        {steps.map((_: CookingStep, index: number) => (
          <div
            key={index}
            className={`flex h-5 w-16 items-start justify-center ${
              index < currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            <p className="text-14sb"> step {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
