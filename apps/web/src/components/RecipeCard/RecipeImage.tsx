import React, { memo } from 'react';
import Image from 'next/image';

import type { Recipe } from '@recipot/types';
import type { MoodType } from '@/components/EmotionState';

import { CARD_DIMENSIONS } from './constants';
import { getBackgroundColor } from './utils';

interface RecipeImageProps {
  index: number;
  isMainCard: boolean;
  recipe: Recipe;
  mood?: MoodType;
}

export const RecipeImage = memo(
  ({ index, isMainCard, mood = 'neutral', recipe }: RecipeImageProps) => {
    const imageUrl = recipe.images[0]?.imageUrl;

    if (!imageUrl) {
      return (
        <div
          className="absolute inset-0"
          style={getBackgroundColor(index, mood)}
        />
      );
    }

    return (
      <div className="absolute inset-0" style={getBackgroundColor(index, mood)}>
        <Image
          src={imageUrl}
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
