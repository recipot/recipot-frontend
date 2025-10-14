import React from 'react';
import Image from 'next/image';

import type { Recipe } from '@/types/recipe.types';

import { CARD_DIMENSIONS } from './constants';
import { getBackgroundColor } from './utils';

interface RecipeImageProps {
  index: number;
  isMainCard: boolean;
  recipe: Recipe;
}

export const RecipeImage = ({
  index,
  isMainCard,
  recipe,
}: RecipeImageProps) => {
  if (isMainCard) {
    return (
      <Image
        src={recipe.image}
        alt={recipe.title}
        width={CARD_DIMENSIONS.width}
        height={CARD_DIMENSIONS.height}
        className="h-full w-full object-cover"
      />
    );
  }

  return <div className="h-full w-full" style={getBackgroundColor(index)} />;
};
