import React from 'react';
import { ChefHat, Clock } from 'lucide-react';

import type { Recipe } from '@/types/recipe.types';

interface RecipeMetaInfoProps {
  recipe: Recipe;
}

export const RecipeMetaInfo = ({ recipe }: RecipeMetaInfoProps) => (
  <div className="absolute top-[20px] left-[20px] h-[32px] w-[270px]">
    <div className="flex gap-2">
      <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
        <Clock className="h-[18px] w-[18px] text-white" />
        <span className="text-17 text-white">{recipe.time}</span>
      </div>
      <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
        <ChefHat className="h-[18px] w-[18px] text-white" />
        <span className="text-17 text-white">{recipe.cookware}</span>
      </div>
    </div>
  </div>
);


