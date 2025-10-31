import React from 'react';

import type { RecipeIngredient, RecipeIngredients } from '@/types/recipe.types';

// 레시피 상세 페이지의 IngredientsGroup 타입과 호환성을 위한 타입
type IngredientsGroupType = {
  owned?: RecipeIngredient[];
  notOwned?: RecipeIngredient[];
  alternativeUnavailable?: RecipeIngredient[];
};

interface IngredientsListProps {
  /** 재료 그룹 */
  ingredients: RecipeIngredients | IngredientsGroupType;
  /** 스타일 variant: 'detail' (레시피 상세 페이지) 또는 'sidebar' (사이드바) */
  variant?: 'detail' | 'sidebar';
}

export function IngredientsList({
  ingredients,
  variant = 'detail',
}: IngredientsListProps) {
  // 모든 재료를 통합 (owned, notOwned, alternativeUnavailable)
  const allIngredients = [
    ...(ingredients?.owned ?? []),
    ...(ingredients?.notOwned ?? []),
    ...(ingredients?.alternativeUnavailable ?? []),
  ];

  // 중복 제거 (name 기준)
  const uniqueIngredients = allIngredients.filter(
    (ingredient, index, arr) =>
      arr.findIndex(item => item.name === ingredient.name) === index
  );

  if (uniqueIngredients.length === 0) {
    return null;
  }

  // 레시피 상세 페이지 스타일
  if (variant === 'detail') {
    return (
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {uniqueIngredients.map((ingredient: RecipeIngredient) => (
            <div
              key={ingredient.id}
              className="bg-secondary-light-green border-secondary-soft-green flex h-[29px] w-fit max-w-full items-center rounded-md border px-3 py-1.5"
            >
              <span className="text-15b text-ingredient-green mr-[5px] min-w-0 truncate">
                {ingredient.name}
              </span>{' '}
              <span className="text-15 text-ingredient-green shrink-0">
                {ingredient.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 사이드바 스타일
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {uniqueIngredients.map((ingredient: RecipeIngredient) => (
          <div
            key={ingredient.id}
            className="border-secondary-soft-green bg-secondary-light-green flex h-[29px] w-fit max-w-full items-center rounded-md border px-3 py-2"
          >
            <span className="text-15b mr-[5px] min-w-0 truncate text-[#53880A]">
              {ingredient.name}
            </span>
            <span className="text-15 shrink-0 text-[#53880A]">
              {ingredient.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
