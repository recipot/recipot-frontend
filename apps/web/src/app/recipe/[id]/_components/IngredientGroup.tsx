import React from 'react';

import {
  INGREDIENT_STATUS_CONFIG,
  type IngredientStatus,
} from './IngredientGroup.constants';

export type { IngredientStatus };

import type { Ingredient, IngredientsGroup } from '../types/recipe.types';

interface IngredientGroupProps {
  ingredients: IngredientsGroup;
  status: IngredientStatus;
}

export function IngredientGroup({ ingredients, status }: IngredientGroupProps) {
  const config = INGREDIENT_STATUS_CONFIG[status];
  const filtered = ingredients[status as keyof IngredientsGroup];

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        {status === 'owned' ? (
          <p className={config.labelClass}>{config.label}</p>
        ) : (
          <span className={config.labelClass}>{config.label}</span>
        )}
      </div>
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtered.map((ingredient: Ingredient) => (
            <div
              key={ingredient.id}
              className={`rounded-md border px-3 py-1.5 text-sm font-bold ${config.color}`}
            >
              <span className={`text-14sb ${config.textColor}`}>
                {ingredient.name} {ingredient.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IngredientGroup;
