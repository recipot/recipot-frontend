import React from 'react';

import type { Ingredient } from '../types/recipe.types';

export const STATUS_CONFIG = {
  owned: {
    as: 'button',
    color:
      'bg-secondary-light-green border-[0.5px] border-secondary-soft-green rounded-[6px] px-3 py-[3px] text-[#8EB35B]',
    label: '보유',
    labelClass: 'text-15sb text-primary',
    render: (ingredient: Ingredient) => (
      <p className="text-14sb text-[#8EB35B]">
        {ingredient.name} {ingredient.amount}
      </p>
    ),
  },
  required: {
    as: 'div',
    color:
      'bg-secondary-light-red border-[0.5px] border-secondary-soft-red rounded-[6px] px-3 py-[3px]',
    label: '대체불가',
    labelClass: 'text-15 text-[#FC5845]',
    render: (ingredient: Ingredient) => (
      <span className="text-14sb text-[#FC5845]">
        {ingredient.name} {ingredient.amount}
      </span>
    ),
  },
  substitutable: {
    as: 'div',
    color:
      'bg-secondary-light-orange border-[0.5px] border-secondary-soft-orange rounded-[6px] px-3 py-[3px] text-[#F88014]',
    label: '대체가능',
    labelClass: 'text-15sb text-primary',
    render: (ingredient: Ingredient) => (
      <>
        <p className="text-14sb mr-[5px] text-[#F88014]">
          {ingredient.name} {ingredient.amount}
        </p>
        <span className="text-13 text-neutral-600 opacity-80">
          {ingredient.substitutes}
        </span>
      </>
    ),
  },
} as const;

interface IngredientGroupProps {
  ingredients: Ingredient[];
  status: keyof typeof STATUS_CONFIG;
}

export function IngredientGroup({ ingredients, status }: IngredientGroupProps) {
  const config = STATUS_CONFIG[status];
  if (!config) {
    return null;
  }
  const filtered = ingredients.filter(
    ingredient => ingredient.status === status
  );
  if (filtered.length === 0) return null;
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        {status === 'owned' ? (
          <p className={config.labelClass}>{config.label}</p>
        ) : (
          <span className={config.labelClass}>{config.label}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map(ingredient => {
          return (
            <div
              key={ingredient.id}
              className={`rounded-md border px-3 py-1.5 text-sm font-bold ${config.color} ${status === 'substitutable' ? 'flex' : ''}`}
            >
              {config.render(ingredient)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IngredientGroup;
