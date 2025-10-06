import React from 'react';

import MeasuringIcon from '@/components/Icons/MeasuringIcon';

import IngredientGroup from './IngredientGroup';

import type { Ingredient, Seasoning } from '../types/recipe.types';

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  ingredientsRef: React.RefObject<HTMLDivElement>;
}

const IngredientsSection = ({
  ingredients,
  ingredientsRef,
  seasonings,
}: IngredientsSectionProps) => {
  return (
    <div ref={ingredientsRef} data-section="ingredients" className="space-y-4">
      {/* Ingredients */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-17sb text-gray-900">재료</p>
          <p className="text-15 text-gray-500">1인분</p>
        </div>
        <IngredientGroup ingredients={ingredients} status="owned" />
        <IngredientGroup ingredients={ingredients} status="substitutable" />
        <IngredientGroup ingredients={ingredients} status="required" />
      </div>

      {/* Seasonings */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
          <button className="flex items-center space-x-1 rounded-md bg-gray-100 px-3 py-1.5">
            <MeasuringIcon />
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
