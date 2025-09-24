'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useState } from 'react';
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
    // TODO : 추후 감정 상태에 따라 그래디언트 적용 필요
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
          <BackIcon
            onClick={() => router.push('/')}
            className="cursor-pointer transition-opacity hover:opacity-70"
          />

          <RefreshIcon
            onClick={() => refetch()}
            className="cursor-pointer transition-opacity hover:opacity-70"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 mb-[17.5px] px-4">
        <div className="flex flex-wrap justify-center gap-[6px]">
          {selectedIngredients.map(ingredient => (
            <div
              key={ingredient}
              className="bg-secondary-light-green border-secondary-soft-green rounded-[6px] border px-2 py-[2px] text-[#53880A]"
            >
              <p className="text-14b">{ingredient}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="flex w-full items-center justify-center px-10">
        {/* TODO : 감정에 따른 감정 상태 표현 변경 필요 */}
        <h2 className="text-22 mr-[2px]">요리할 여유가 그저 그래요</h2>
        <div className="text-24 flex h-6 w-6 items-center">😑</div>
      </div>

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
                    snackbarMessage={snackbarMessage}
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
