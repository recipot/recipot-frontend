'use client';

import Image from 'next/image';

import { CookOrderIcon } from '@/components/Icons';
import type { CookingStep, Recipe } from '@/types/recipe.types';

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
      <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
        {currentStepData.imageUrl ? (
          <Image
            src={currentStepData.imageUrl}
            alt={currentStepData.title}
            width={400}
            height={225}
            className="h-full w-full object-cover"
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
      <div className="mb-6">
        {/* 원형 인디케이터 */}
        <div className="mb-2 flex w-[390px] items-center justify-center px-6">
          {recipe.cookingSteps.map((_: CookingStep, index: number) => (
            <div key={index} className="mt-[147px] flex items-center">
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
              {index < recipe.cookingSteps.length - 1 && (
                <div className="mr-[2px] ml-[2px] h-0.5 w-12 bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* 순서 라벨 */}
        <div className="flex justify-center">
          {recipe.cookingSteps.map((_: CookingStep, index: number) => (
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
    </div>
  );
}
