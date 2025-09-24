import React from 'react';

import type { Ingredient, Seasoning } from '../types/recipe.types';

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  ingredientsRef: React.RefObject<HTMLDivElement>;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  ingredientsRef,
  seasonings,
}) => {
  const getIngredientStatusColor = (status: string) => {
    switch (status) {
      case 'owned':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'substitutable':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'required':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div ref={ingredientsRef} data-section="ingredients" className="space-y-4">
      {/* Ingredients */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-17sb text-gray-900">재료</p>
          <p className="text-15 text-gray-500">1인분</p>
        </div>

        {/* Owned Ingredients */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-15sb text-primary">보유</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients
              .filter(ing => ing.status === 'owned')
              .map(ingredient => (
                <button
                  key={ingredient.id}
                  className={`rounded-md border px-3 py-1.5 text-sm font-bold ${getIngredientStatusColor(ingredient.status)}`}
                >
                  <p className="text-14b">
                    {ingredient.name} {ingredient.amount}
                  </p>
                </button>
              ))}
          </div>
        </div>

        {/* Substitutable Ingredients */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-orange-600">
              대체가능
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients
              .filter(ing => ing.status === 'substitutable')
              .map(ingredient => (
                <div
                  key={ingredient.id}
                  className={`rounded-md border px-3 py-1.5 text-sm font-bold ${getIngredientStatusColor(ingredient.status)} flex`}
                >
                  <p className="text-14b mr-[5px] text-[#F88014]">
                    {ingredient.name} {ingredient.amount}
                  </p>
                  <span className="text-13 ml-1 text-neutral-600 opacity-70">
                    {ingredient.substitutes}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Required Ingredients */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-red-600">대체불가</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients
              .filter(ing => ing.status === 'required')
              .map(ingredient => (
                <div
                  key={ingredient.id}
                  className={`rounded-md border px-3 py-1.5 text-sm font-bold ${getIngredientStatusColor(ingredient.status)}`}
                >
                  <span>
                    {ingredient.name} {ingredient.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Seasonings */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
          <button className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1.5">
            <span className="text-sm font-bold text-gray-600">계량가이드</span>
          </button>
        </div>
        <div className="space-y-0">
          {seasonings.map((seasoning, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0"
            >
              <span className="text-sm text-gray-600">{seasoning.name}</span>
              <span className="text-sm text-gray-600">{seasoning.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientsSection;
