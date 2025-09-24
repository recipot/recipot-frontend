import React from 'react';

import type { CookingStep } from '../types/recipe.types';

interface StepsSectionProps {
  steps: CookingStep[];
  stepsRef: React.RefObject<HTMLDivElement>;
}

const StepsSection: React.FC<StepsSectionProps> = ({ steps, stepsRef }) => {
  return (
    <div
      ref={stepsRef}
      data-section="steps"
      className="mt-6 rounded-2xl bg-white p-4"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">요리순서</h3>
      <div className="space-y-6">
        {steps.map(step => (
          <div key={step.step} className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
                <span className="text-xs font-bold text-white">
                  {step.step}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsSection;
