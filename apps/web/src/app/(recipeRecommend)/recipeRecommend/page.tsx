'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import { BackIcon, RefreshIcon } from '@/components/Icons';
import { RecipeCard } from '@/components/RecipeCard';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useRecipeRecommend } from '@/hooks/useRecipeRecommend';

// Carousel 설정
const carouselOpts = {
  align: 'center' as const,
  loop: false,
};

export default function RecipeRecommend() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const {
    error,
    fetchRecipeRecommend,
    likedRecipes,
    loading,
    recipes,
    selectedIngredients,
    snackbarMessage,
    toggleLike,
  } = useRecipeRecommend();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, recipes]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-600">레시피를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={fetchRecipeRecommend}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="container mx-auto mt-8 px-4 sm:mt-12 sm:px-6 md:mt-[62px] lg:px-8">
        <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
          <BackIcon />
          <h1 className="text-18b text-center">타이틀</h1>
          <RefreshIcon onClick={fetchRecipeRecommend} />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {selectedIngredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-secondary-light-green text-12b sm:text-14b text-secondary-pressed rounded-full px-2 py-[2px] sm:px-3 sm:py-[3px]"
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

      {/* 슬라이드 카드 */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* 네비게이션 화살표 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-lg transition-all duration-300 disabled:opacity-50 sm:left-4 sm:h-10 sm:w-10"
            disabled={current === 1}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-lg transition-all duration-300 disabled:opacity-50 sm:right-4 sm:h-10 sm:w-10"
            disabled={current === count}
          />

          <Carousel
            setApi={setApi}
            className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg"
            opts={carouselOpts}
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {recipes.map((recipe, index) => (
                <CarouselItem key={recipe.id} className="pl-2 sm:pl-4">
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Page Indicator */}
        <div className="mt-4 flex justify-center gap-1.5 sm:mt-6 sm:gap-2">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 sm:h-2 sm:w-2 ${
                i === current - 1
                  ? 'scale-125 bg-gray-900 shadow-lg'
                  : 'bg-gray-200'
              }`}
              onClick={() => api?.scrollTo(i)}
              aria-label={`${i + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
