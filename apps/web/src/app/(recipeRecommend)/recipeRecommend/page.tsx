'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import { BackIcon, RefreshIcon } from '@/components/Icons';
import { RecipeCard } from '@/components/RecipeCard';
import {
  fetchRecipeRecommend,
  useRecipeRecommend,
} from '@/hooks/useRecipeRecommend';

const SWIPER_MODULES = [EffectCards, Pagination];

// Swiper 스타일 상수
const swiperStyles = {
  '--swiper-navigation-color': '#212529',
  '--swiper-pagination-color': '#212529',
} as React.CSSProperties;

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
  const router = useRouter();

  // TanStack Query로 레시피 데이터 조회
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { likedRecipes, selectedIngredients, toggleLike } =
    useRecipeRecommend();

  // Swiper 설정 상수
  const SWIPER_CONFIG = {
    allowTouchMove: true,
    cardsEffect: {
      perSlideOffset: 12,
      perSlideRotate: 3,
      rotate: true,
      slideShadows: false,
    },
    effect: 'cards' as const,
    grabCursor: true,
    pagination: {
      clickable: true,
      el: '.recipe-pagination',
    },
    resistanceRatio: 0.85,
    slidesPerView: 1,
    spaceBetween: 0,
    threshold: 5,
    touchRatio: 1,
  };

  const recipes = data?.recipes ?? [];
  const snackbarMessage = data?.message ?? '';

  // 로딩 상태
  if (isLoading) {
    return <LoadingState />;
  }

  // 에러 상태
  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <>
      {/* Header */}
      <div className="container mx-auto mt-8 px-4 sm:mt-12 sm:px-6 md:mt-[62px] lg:px-8">
        <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
          <BackIcon
            onClick={() => router.push('/')}
            className="cursor-pointer transition-opacity hover:opacity-70"
          />

          <h1 className="text-18b text-center">타이틀</h1>
          <RefreshIcon
            onClick={() => refetch()}
            className="cursor-pointer transition-opacity hover:opacity-70"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {selectedIngredients.map(ingredient => (
            <div
              key={ingredient}
              className="bg-secondary-light-green text-12b sm:text-14b rounded-full px-2 py-[2px] text-[#53880A] sm:px-3 sm:py-[3px]"
            >
              {ingredient}
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 px-4 text-center sm:px-6 lg:px-8">
        <span className="text-18 sm:text-20 md:text-22">
          요리할 여유가 그저 그래요
        </span>
        <span className="text-24 ml-2">😑</span>
      </div>

      {/* Swiper Cards Effect */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="relative h-[530px] w-[350px]">
            <Swiper
              modules={SWIPER_MODULES}
              {...SWIPER_CONFIG}
              className="recipe-swiper h-full w-full"
              style={swiperStyles}
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
                    snackbarMessage={snackbarMessage}
                    onToggleLike={toggleLike}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Page Indicator */}
        <div className="recipe-pagination mt-4 flex justify-center gap-1.5 sm:mt-6 sm:gap-2" />
      </div>
    </>
  );
}
