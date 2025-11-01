import React, { memo } from 'react';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';

interface RecipeContentProps {
  recipe: Recipe;
}

export const RecipeContent = memo(({ recipe }: RecipeContentProps) => (
  <div className="w-full px-5 pt-10 pb-4">
    <div className="mb-4">
      <p className="text-17 mb-2 line-clamp-1 text-white opacity-90">
        {recipe.title}
      </p>
      <h2 className="text-24 line-clamp-2 text-white">{recipe.description}</h2>
    </div>
  </div>
));

RecipeContent.displayName = 'RecipeContent';
