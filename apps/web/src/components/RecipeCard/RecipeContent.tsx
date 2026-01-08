import React, { memo } from 'react';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import { cn } from '@/lib/utils';

interface RecipeContentProps {
  recipe: Recipe;
  className?: string;
  variant?: 'default' | 'compact';
}

export const RecipeContent = memo(
  ({ className, recipe, variant = 'default' }: RecipeContentProps) => {
    const isCompact = variant === 'compact';

    return (
      <div className="w-full px-5 pt-10 pb-6 text-white">
        <p
          className={cn(
            'mb-2 line-clamp-1 opacity-90',
            isCompact ? 'text-12.75' : 'text-17'
          )}
        >
          {recipe.title}
        </p>
        <h2
          className={cn(
            'line-clamp-2',
            isCompact ? 'text-18sb' : 'text-24',
            className
          )}
        >
          {recipe.description}
        </h2>
      </div>
    );
  }
);

RecipeContent.displayName = 'RecipeContent';
