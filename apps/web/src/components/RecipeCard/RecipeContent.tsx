import React from 'react';

import type { Recipe } from '@/types/recipe.types';

import { GRADIENT_STYLE } from './constants';
import { formatRecipeTitle } from './utils';

interface RecipeContentProps {
  recipe: Recipe;
}

export const RecipeContent = ({ recipe }: RecipeContentProps) => (
  <div
    className="absolute bottom-0 left-0 h-[244px] w-[310px]"
    style={GRADIENT_STYLE}
  >
    <div className="absolute top-[40px] left-[20px] h-[104px] w-[270px]">
      <p className="text-17 mb-2 line-clamp-1 text-white opacity-90">
        {recipe.subtitle}
      </p>
      <h2 className="text-24 line-clamp-2 text-white">
        {formatRecipeTitle(recipe.title).map((line, i, array) => (
          <span key={i}>
            {line}
            {i < array.length - 1 && <br />}
          </span>
        ))}
      </h2>
    </div>
  </div>
);
