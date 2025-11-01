'use client';

import Image from 'next/image';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import { CookOrderIcon } from '@/components/Icons';

interface CookingOrderContentProps {
  recipe: Recipe;
  currentStep: number;
}

export default function CookingOrderContent({
  currentStep,
  recipe,
}: CookingOrderContentProps) {
  const currentStepData = recipe.steps?.[currentStep - 1];

  return (
    <div className="px-4 py-6">
      {/* 이미지 */}
      <div className="mb-4 aspect-video overflow-hidden bg-gray-100">
        {recipe?.images?.[currentStep - 1]?.imageUrl ? (
          <Image
            src={recipe?.images?.[currentStep - 1]?.imageUrl}
            alt={recipe?.title}
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

      <p className="text-16 px-6 text-[#000]">{currentStepData?.summary}</p>

      {/* 단계 진행률 */}
      <div className="mt-[147px] mb-6 flex flex-col items-center">
        {/* 원형 인디케이터 */}
        <div className="mb-2 flex items-center justify-center px-6">
          {recipe.steps?.map((step, index: number) => (
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
              {index < (recipe.steps?.length ?? 0) - 1 && (
                <div className="mr-[2px] ml-[2px] h-0.5 w-12 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
        {/* 순서 라벨 */}
        <div className="flex justify-center">
          {recipe.steps?.map((step, index: number) => (
            <div
              key={step.orderNum}
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
