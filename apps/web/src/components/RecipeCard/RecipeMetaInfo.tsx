import React, { memo } from 'react';
import { ChefHat, Clock } from 'lucide-react';

import type { Recipe } from '@/types/recipe.types';

interface RecipeMetaInfoProps {
  recipe: Recipe;
}

export const RecipeMetaInfo = memo(({ recipe }: RecipeMetaInfoProps) => (
  <div className="flex gap-2">
    <div className="flex h-[32px] items-center gap-1 px-3">
      <Clock className="h-[18px] w-[18px] text-white" />
      <span className="text-17 whitespace-nowrap text-white">
        {recipe.duration}
      </span>
    </div>
    <div className="flex h-[32px] items-center gap-1 px-3">
      <ChefHat className="h-[18px] w-[18px] text-white" />
      <span className="text-17 whitespace-nowrap text-white">
        {recipe.tools?.length}
      </span>
    </div>
  </div>
));

RecipeMetaInfo.displayName = 'RecipeMetaInfo';
