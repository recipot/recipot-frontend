import React, { memo } from 'react';

import type { Recipe } from '@/types/recipe.types';

import { CARD_STYLES } from './constants';
import { RecipeActions } from './RecipeActions';
import { RecipeContent } from './RecipeContent';
import { RecipeImage } from './RecipeImage';
import { RecipeMetaInfo } from './RecipeMetaInfo';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isLiked: boolean;
  onToggleLike: (index: number, recipeId: number) => void;
  isMainCard?: boolean;
}

export const RecipeCard = memo(
  ({
    index,
    isLiked,
    isMainCard = false,
    onToggleLike,
    recipe,
  }: RecipeCardProps) => {
    const handleToggleLike = () => {
      onToggleLike(index, recipe.id);
    };

    return (
      <div className="relative" style={CARD_STYLES.container}>
        <div
          className="relative z-10 overflow-hidden rounded-[32px] bg-white"
          style={CARD_STYLES.card}
        >
          {/* 이미지 영역 */}
          <RecipeImage index={index} isMainCard={isMainCard} recipe={recipe} />

          {/* 메인 카드 전용 요소들 */}
          {isMainCard && (
            <>
              <RecipeMetaInfo recipe={recipe} />
              <RecipeContent recipe={recipe} />
              <RecipeActions
                isLiked={isLiked}
                onToggleLike={handleToggleLike}
              />
            </>
          )}
        </div>
      </div>
    );
  }
);

RecipeCard.displayName = 'RecipeCard';
