'use client';

import Image from 'next/image';

import { CookOrderIcon } from '@/components/Icons';
import type { Recipe } from '@/types/recipe.types';

import StepProgressIndicator from './StepProgressIndicator';

interface CookingOrderContentProps {
  recipe: Recipe;
  currentStep: number;
}

export default function CookingOrderContent({
  currentStep,
  recipe,
}: CookingOrderContentProps) {
  const currentStepData = recipe.cookingSteps[currentStep - 1];

  return (
    <div className="px-4 py-6">
      {/* 이미지 */}
      <div className="mb-6 aspect-video overflow-hidden bg-gray-100">
        {currentStepData.imageUrl ? (
          <Image
            src={currentStepData.imageUrl}
            alt={currentStepData.title}
            width={390}
            height={260}
            className="bg-[#EDF0F7] object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <CookOrderIcon size={48} color="#68982D" />
          </div>
        )}
      </div>

      {/* 설명 */}
      <div>
        <p className="text-16 text-[#000]">{currentStepData.description}</p>
      </div>

      {/* 단계 진행률 */}
      <StepProgressIndicator
        steps={recipe.cookingSteps}
        currentStep={currentStep}
      />
    </div>
  );
}
