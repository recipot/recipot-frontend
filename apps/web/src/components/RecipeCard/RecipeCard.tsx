import React, { memo, useCallback } from 'react';

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
    const handleToggleLike = useCallback(() => {
      onToggleLike(index, recipe.id);
    }, [onToggleLike, index, recipe.id]);

    return (
      <div className="relative" style={CARD_STYLES.container}>
        <div
          className="relative z-10 overflow-hidden rounded-[32px] bg-white"
          style={CARD_STYLES.card}
        >
          {/* 이미지 영역 */}
          <RecipeImage index={index} isMainCard={isMainCard} recipe={recipe} />

          {/* 메인 카드 전용 요소들 - 항상 렌더링하되 CSS로 표시/숨김 처리 */}
          <div
            className={`transition-opacity duration-300 ${isMainCard ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <RecipeMetaInfo recipe={recipe} />
            <RecipeContent recipe={recipe} />
            <RecipeActions isLiked={isLiked} onToggleLike={handleToggleLike} />
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 커스텀 비교 함수로 불필요한 리렌더링 방지
    return (
      prevProps.recipe.id === nextProps.recipe.id &&
      prevProps.recipe.title === nextProps.recipe.title &&
      prevProps.recipe.image === nextProps.recipe.image &&
      prevProps.isLiked === nextProps.isLiked &&
      prevProps.isMainCard === nextProps.isMainCard &&
      prevProps.index === nextProps.index
    );
  }
);

RecipeCard.displayName = 'RecipeCard';
