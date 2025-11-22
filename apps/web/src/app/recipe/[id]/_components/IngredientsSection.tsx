'use client';

import React from 'react';

import type {
  IngredientsGroup,
  Seasoning,
} from '@/app/recipe/[id]/types/recipe.types';
import Title from '@/components/common/RecipeDetails/common/Title';
import { IngredientsList } from '@/components/common/RecipeDetails/IngredientsList';
import { SeasoningsSection } from '@/components/common/RecipeDetails/SeasoningsSection';

interface IngredientsSectionProps {
  ingredients: IngredientsGroup;
  seasonings: Seasoning[];
}

export function IngredientsSection({
  ingredients,
  seasonings,
}: IngredientsSectionProps) {
  return (
    <div id="ingredients" className="space-y-8 rounded-2xl bg-white p-6">
      {/* Ingredients */}
      <div className="space-y-5">
        <Title title="재료">
          <p className="text-15 text-gray-600">1인분</p>
        </Title>
        <IngredientsList ingredients={ingredients} variant="detail" />
      </div>
      <SeasoningsSection seasonings={seasonings} variant="detail" showIcon />
    </div>
  );
}

export default IngredientsSection;
