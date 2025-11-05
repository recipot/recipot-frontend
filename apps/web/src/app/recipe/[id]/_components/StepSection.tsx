import React from 'react';

import Title from '@/components/common/RecipeDetails/common/Title';

import type { CookingStep } from '../types/recipe.types';

interface StepSectionProps {
  steps: CookingStep[];
}

export function StepSection({ steps }: StepSectionProps) {
  return (
    <div id="steps" className="space-y-5 rounded-2xl bg-white px-6 py-7">
      <Title title="요리순서" />
      <div className="space-y-6">
        {steps?.map((step, index) => (
          <React.Fragment key={step.orderNum}>
            <div className="flex space-x-5">
              <div>
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-[100px] px-[2px] py-[7px]">
                  <span className="text-12 text-white">{step.orderNum}</span>
                </div>
              </div>
              <div>
                <p className="text-15 text-gray-700">{step.summary}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="h-0 w-full border-t border-dashed border-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default StepSection;
