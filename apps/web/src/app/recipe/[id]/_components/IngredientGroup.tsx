import React from 'react';

import type { Ingredient, IngredientsGroup } from '../types/recipe.types';

interface IngredientGroupProps {
  ingredients: IngredientsGroup;
}

export function IngredientGroup({ ingredients }: IngredientGroupProps) {
  // 모든 재료를 통합 (owned, notOwned, alternativeUnavailable)
  const allIngredients = [
    ...ingredients.owned,
    ...ingredients.notOwned,
    ...ingredients.alternativeUnavailable,
  ];

  const uniqueIngredients = allIngredients.reduce((acc, current) => {
    const existing = acc.find(
      item => item.name === current.name && item.amount === current.amount
    );
    if (!existing) {
      acc.push(current);
    }
    return acc;
  }, [] as Ingredient[]);

  return (
    <div className="mb-4">
      {uniqueIngredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uniqueIngredients.map((ingredient: Ingredient) => (
            <div
              key={`${ingredient.name}-${ingredient.amount}`}
              className="bg-secondary-light-green border-secondary-soft-green rounded-md border px-3 py-1.5"
            >
              <span className="text-15b text-ingredient-green">
                {ingredient.name}
              </span>{' '}
              <span className="text-15 text-ingredient-green">
                {ingredient.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientGroup;
