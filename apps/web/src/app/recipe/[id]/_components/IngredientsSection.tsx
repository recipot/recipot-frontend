'use client';

import React from 'react';

import { IngredientsList } from '@/components/common/IngredientsList';
import { SeasoningsList } from '@/components/common/SeasoningsList';
import { MeasurementGuide } from '@/components/MeasurementGuide';

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

        <div className="mt-8">
          <div className="rounded-2xl bg-white p-4">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
            </div>

            <SeasoningsList seasonings={seasonings} variant="detail" showIcon />

            <div className="mt-5">
              <MeasurementGuide />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientsSection;
