'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import { RecipeCard } from '@/components/RecipeCard';
import {
  fetchRecipeRecommend,
  useRecipeRecommend,
} from '@/hooks/useRecipeRecommend';

import RecipeHeader from './_components/RecipeHeader';
import RecipeTags from './_components/RecipeTags';
import RecipeTitle from './_components/RecipeTitle';
import { SWIPER_CONFIG, SWIPER_MODULES, swiperStyles } from '../constants';

// 로딩 컴포넌트
const LoadingState = () => (
  <div className="flex h-screen flex-col items-center justify-center">
    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    <p className="text-gray-600">레시피를 불러오는 중...</p>
  </div>
);

// 에러 컴포넌트
const ErrorState = ({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry: () => void;
}) => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <p className="mb-4 text-red-600">
        {error?.message ?? '레시피를 불러오는데 실패했습니다.'}
      </p>
      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  </div>
);

export default function RecipeRecommend() {
  const [activeIndex, setActiveIndex] = useState(0);

  // TanStack Query로 레시피 데이터 조회
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { likedRecipes, selectedIngredients, toggleLike } =
    useRecipeRecommend();

  // Swiper 설정 상수

  const recipes = data?.recipes ?? [];

  // 로딩 상태
  if (isLoading) {
    return <LoadingState />;
  }

  // 에러 상태
  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    // TODO : 추후 감정 상태에 따라 그래디언트 적용 필요
    <div className="mt-[54px] min-h-screen">
      {/* Header */}
      <RecipeHeader />
      {/* Tags */}
      <RecipeTags selectedIngredients={selectedIngredients} />

      {/* Title */}
      <RecipeTitle />

      {/* Swiper Cards Effect */}
      <div className="mt-10 px-4">
        <div className="flex justify-center">
          <div className="relative h-[460px] w-[344px]">
            <Swiper
              modules={SWIPER_MODULES}
              {...SWIPER_CONFIG}
              className="recipe-swiper h-full w-full"
              style={swiperStyles}
              onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            >
              {recipes.map((recipe, index) => (
                <SwiperSlide
                  key={recipe.id}
                  className="flex items-center justify-center"
                >
                  <RecipeCard
                    recipe={recipe}
                    index={index}
                    isLiked={
                      index >= 0 && index < likedRecipes.length
                        ? likedRecipes[index]
                        : false
                    }
                    onToggleLike={toggleLike}
                    isMainCard={index === activeIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Page Indicator */}
        <div className="recipe-pagination mt-4 flex justify-center gap-1.5 sm:mt-6 sm:gap-2" />
      </div>
    </div>
  );
}
