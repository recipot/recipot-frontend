import React, { memo } from 'react';
import Image from 'next/image';

import type { Recipe } from '@/types/recipe.types';

import { CARD_DIMENSIONS } from './constants';
import { getBackgroundColor } from './utils';

interface RecipeImageProps {
  index: number;
  isMainCard: boolean;
  recipe: Recipe;
}

export const RecipeImage = memo(
  ({ index, isMainCard, recipe }: RecipeImageProps) => {
    return (
      <div className="absolute inset-0" style={getBackgroundColor(index)}>
        <Image
          src={recipe.images[0].imageUrl}
          alt={recipe.title}
          width={CARD_DIMENSIONS.width}
          height={CARD_DIMENSIONS.height}
          className={`h-full w-full object-cover transition-opacity duration-300 ${isMainCard ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>
    );
  }
);

RecipeImage.displayName = 'RecipeImage';
