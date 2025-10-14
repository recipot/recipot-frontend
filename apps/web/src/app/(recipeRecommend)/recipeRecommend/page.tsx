'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import {
  fetchRecipeRecommend,
  useRecipeRecommend,
} from '@/hooks/useRecipeRecommend';
import { useToast } from '@/hooks/useToast';

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
  const { isVisible, message, showToast } = useToast();

  // TanStack Query로 레시피 데이터 조회
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { likedRecipes, selectedIngredients, toggleLike } =
    useRecipeRecommend();

  // 토스트 상태 관리
  const [toastIcon, setToastIcon] = useState<'heart' | 'recipe'>('recipe');

  // 하트 아이콘 클릭 시 토스트 표시를 위한 래퍼 함수
  const handleToggleLike = useCallback(
    (index: number, recipeId: number) => {
      const isCurrentlyLiked = likedRecipes[index] ?? false;
      toggleLike(index, recipeId);

      // 좋아요 상태가 변경될 때 토스트 표시
      if (!isCurrentlyLiked) {
        setToastIcon('heart');
        showToast('레시피가 저장되었어요');
      }
    },
    [likedRecipes, toggleLike, showToast]
  );

  // 새로고침 버튼 클릭 시 토스트 표시를 위한 래퍼 함수
  const handleRefresh = useCallback(() => {
    refetch();
    setToastIcon('recipe');
    showToast('새로운 레시피가 추천되었어요');
  }, [refetch, showToast]);

  const recipes = data?.recipes ?? [];

  // 이미지 사전 로딩
  useEffect(() => {
    if (recipes.length > 0) {
      // 현재 카드와 다음 2개 카드의 이미지를 미리 로딩
      const preloadImages = recipes.slice(activeIndex, activeIndex + 3);
      preloadImages.forEach(recipe => {
        const img = new Image();
        img.src = recipe.image;
      });
    }
  }, [activeIndex, recipes]);

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
      <RecipeHeader onRefresh={handleRefresh} />
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
                    isLiked={likedRecipes[index] ?? false}
                    onToggleLike={handleToggleLike}
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

      {/* 전역 토스트 */}
      <Toast message={message} isVisible={isVisible} icon={toastIcon} />
    </div>
  );
}
