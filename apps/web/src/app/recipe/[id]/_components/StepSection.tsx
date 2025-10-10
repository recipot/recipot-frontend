import React from 'react';

import type { CookingStep } from '../types/recipe.types';

interface StepSectionProps {
  steps: CookingStep[];
  stepsRef: React.RefObject<HTMLDivElement>;
}

export function StepSection({ steps, stepsRef }: StepSectionProps) {
  return (
    <div
      ref={stepsRef}
      data-section="steps"
      className="mt-6 rounded-2xl bg-white p-6"
    >
      <h3 className="text-17sb mb-4 text-gray-900">요리순서</h3>
      <div className="space-y-6">
        {steps.map(step => (
          <div key={step.step} className="flex space-x-4">
            <div className="mr-5">
              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-[100px] px-[2px] py-[7px]">
                <span className="text-12 text-white">{step.step}</span>
              </div>
            </div>
            <div>
              <p className="text-15 text-gray-700">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepSection;
