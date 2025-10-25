import React, { memo, useCallback } from 'react';

import type { Recipe } from '@/types/recipe.types';

import { CARD_STYLES, GRADIENT_OVERLAY_STYLE } from './constants';
import { RecipeActions } from './RecipeActions';
import { RecipeContent } from './RecipeContent';
import { RecipeImage } from './RecipeImage';
import { RecipeMetaInfo } from './RecipeMetaInfo';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isLiked?: boolean;
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

    const handleCardClick = useCallback(() => {
      // 레시피 상세 URL로 이동 (외부 링크 또는 API 엔드포인트)
      window.open(`/recipe/${recipe.id}`, '_blank');
    }, [recipe.id]);

    return (
      <div style={CARD_STYLES.container} onClick={handleCardClick}>
        <div
          className="relative z-10 flex flex-col overflow-hidden rounded-[32px] bg-white"
          style={CARD_STYLES.card}
        >
          {/* 배경 이미지 */}
          <RecipeImage index={index} isMainCard={isMainCard} recipe={recipe} />

          {/* 메인 카드 전용 요소들 - 항상 렌더링하되 CSS로 표시/숨김 처리 */}
          <div
            className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${isMainCard ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            {/* 하단 그라데이션 오버레이 */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
              style={GRADIENT_OVERLAY_STYLE}
            />

            <div className="flex size-full flex-col justify-between">
              {/* 상단 메타 정보 */}
              <div className="recipe-card-meta flex w-full py-5 pl-5">
                <RecipeMetaInfo recipe={recipe} />
              </div>

              {/* 하단 컨텐츠 영역 */}
              <div className="z-10">
                <RecipeContent recipe={recipe} />
                <RecipeActions
                  isLiked={isLiked}
                  onToggleLike={handleToggleLike}
                />
              </div>
            </div>
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
      prevProps.recipe.images[0].imageUrl ===
        nextProps.recipe.images[0].imageUrl &&
      prevProps.isLiked === nextProps.isLiked &&
      prevProps.isMainCard === nextProps.isMainCard &&
      prevProps.index === nextProps.index
    );
  }
);

RecipeCard.displayName = 'RecipeCard';
