import React, { memo } from 'react';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';

import { CardTimeIcon, CookwareIcon } from '../Icons';

interface RecipeMetaInfoProps {
  recipe: Recipe;
}

export const RecipeMetaInfo = memo(({ recipe }: RecipeMetaInfoProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex h-[32px] items-center gap-1 px-3">
        <CardTimeIcon size={22} color="#FFFFFF" />
        <span className="text-17 whitespace-nowrap text-white">
          {recipe.duration}
        </span>
      </div>
      <div className="flex h-[32px] items-center gap-1 px-3">
        <CookwareIcon className="h-[22px] w-[22px]" color="#FFFFFF" />
        <span className="text-17 whitespace-nowrap text-white">
          {recipe.tools.map(tool => tool.name).join(', ')}
        </span>
      </div>
    </div>
  );
});

RecipeMetaInfo.displayName = 'RecipeMetaInfo';
