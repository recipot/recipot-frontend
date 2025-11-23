import React from 'react';

import type { Ingredient, IngredientsGroup } from '@recipot/types';

// 레시피 상세 페이지의 IngredientsGroup 타입과 호환성을 위한 타입
type IngredientsGroupType = {
  owned?: Ingredient[];
  notOwned?: Ingredient[];
  alternativeUnavailable?: Ingredient[];
};

interface IngredientsListProps {
  /** 재료 그룹 */
  ingredients: IngredientsGroup | IngredientsGroupType;
  /** 스타일 variant: 'detail' (레시피 상세 페이지) 또는 'sidebar' (사이드바) */
  variant?: 'detail' | 'sidebar';
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
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

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueIngredients.map((ingredient: Ingredient) => (
        <div
          key={ingredient.id}
          className="bg-secondary-light-green border-secondary-soft-green flex h-[29px] w-fit max-w-full items-center gap-[5px] rounded-md border px-3"
        >
          <span className="text-15b text-ingredient-green min-w-0 truncate">
            {ingredient.name}
          </span>
          {ingredient.amount && (
            <span className="text-15 text-ingredient-green shrink-0">
              {ingredient.amount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
