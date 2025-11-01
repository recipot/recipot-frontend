'use client';

import React from 'react';

import { IngredientsList } from '@/components/common/IngredientsList';
import { SeasoningsSection } from '@/components/common/SeasoningsSection';

import type { IngredientsGroup, Seasoning } from '../types/recipe.types';

interface IngredientsSectionProps {
  ingredients: IngredientsGroup;
  seasonings: Seasoning[];
}

export function IngredientsSection({
  ingredients,
  seasonings,
}: IngredientsSectionProps) {
  return (
    <div id="ingredients" className="space-y-4">
      {/* Ingredients */}
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-17sb text-gray-900">재료</p>
          <p className="text-15 text-gray-500">1인분</p>
        </div>
        <IngredientsList ingredients={ingredients} variant="detail" />

        <SeasoningsSection seasonings={seasonings} variant="detail" showIcon />
      </div>
    </div>
  );
}

export default IngredientsSection;
