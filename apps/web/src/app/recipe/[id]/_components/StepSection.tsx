import React from 'react';

import type { CookingStep } from 'packages/api/src/types';

interface StepSectionProps {
  steps: CookingStep[];
}

export function StepSection({ steps }: StepSectionProps) {
  return (
    <div id="steps" className="mt-6 h-[44rem] rounded-2xl bg-white p-6">
      <h3 className="text-17sb mb-4 text-gray-900">요리순서</h3>
      <div className="space-y-6">
        {steps?.map(step => (
          <div key={step.orderNum} className="flex space-x-5">
            <div>
              <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-[100px] px-[2px] py-[7px]">
                <span className="text-12 text-white">{step.orderNum}</span>
              </div>
            </div>
            <div>
              <p className="text-15 text-gray-700">{step.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepSection;
