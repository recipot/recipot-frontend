'use client';

import React, { useEffect, useState } from 'react';
import { ChefHat, Clock } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { BackIcon, CookIcon, HeartIcon, RefreshIcon } from '@/components/Icons';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

// API 응답 타입
interface Recipe {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  cookware: string;
  image: string;
  description: string;
}

interface RecipeRecommendResponse {
  recipes: Recipe[];
  selectedIngredients: string[];
  message: string;
}

// Carousel 설정
const carouselOpts = {
  align: 'center' as const,
  loop: false,
};

export default function RecipeRecommend() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [likedRecipes, setLikedRecipes] = useState<boolean[]>([]);

  // API 상태
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchRecipeRecommend = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipe-recommend');

      if (!response.ok) {
        throw new Error('레시피 추천을 불러오는데 실패했습니다.');
      }

      const data: RecipeRecommendResponse = await response.json();

      setRecipes(data.recipes);
      setSelectedIngredients(data.selectedIngredients);
      setSnackbarMessage(data.message);
      setLikedRecipes(new Array(data.recipes.length).fill(false));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchRecipeRecommend();
  }, []);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, recipes]);

  const toggleLike = async (index: number) => {
    if (index >= 0 && index < recipes.length) {
      const recipe = recipes[index];
      const isCurrentlyLiked = likedRecipes[index];

      try {
        const response = await fetch(
          `/api/recipe-recommend/${recipe.id}/like`,
          {
            method: isCurrentlyLiked ? 'DELETE' : 'POST',
          }
        );

        if (response.ok) {
          setLikedRecipes(prev => {
            const newLikes = [...prev];
            newLikes[index] = !newLikes[index];
            return newLikes;
          });
        }
      } catch (err) {
        console.error('좋아요 토글 실패:', err);
      }
    }
  };

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
                  <div className="relative h-[530px] w-[310px]">
                    {/* 배경 카드들 - Figma 디자인 정확한 위치 */}
                    {/* back-card2: 가장 뒤쪽 카드 */}
                    <div className="absolute top-[5px] left-[13.999px] h-[449.74px] w-[315.36px] rounded-[30px] bg-[#e6e1cc] shadow-[0_8px_32px_rgba(0,0,0,0.1)]" />
                    {/* back-card3: 중간 카드 */}
                    <div className="absolute top-[25px] left-[73.001px] h-[372.75px] w-[271.29px] rounded-[30px] bg-[#f5f2e5] shadow-[0_4px_16px_rgba(0,0,0,0.08)]" />

                    {/* 메인 카드 - card-front */}
                    <div className="relative z-10 h-[460px] w-[310px] overflow-hidden rounded-[32px] bg-[#f9fbff] shadow-[0_16px_48px_rgba(0,0,0,0.15)]">
                      {/* 이미지 영역 */}
                      <div className="absolute top-0 left-0 h-[386px] w-[310px]">
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          width={310}
                          height={386}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* 상단 배지들 - 정확한 위치 */}
                      <div className="absolute top-[20px] left-[20px] h-[32px] w-[210px]">
                        <div className="flex gap-2">
                          <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
                            <Clock className="h-[18px] w-[18px] text-white" />
                            <span className="text-17 text-white">
                              {recipe.time}
                            </span>
                          </div>
                          <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
                            <ChefHat className="h-[18px] w-[18px] text-white" />
                            <span className="text-17 text-white">
                              {recipe.cookware}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 하단 텍스트와 버튼 영역 - 그라데이션 배경 */}
                      <div className="absolute bottom-0 left-0 h-[242px] w-[310px] bg-gradient-to-t from-[#b9aa6d] via-[#b9aa6d] to-[#b9aa6d00]">
                        {/* 텍스트 영역 */}
                        <div className="absolute top-[40px] left-[20px] h-[104px] w-[270px]">
                          <p className="text-17 mb-2 text-white opacity-90">
                            {recipe.subtitle}
                          </p>
                          <h2 className="text-24 leading-tight font-semibold text-white">
                            {recipe.title.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < recipe.title.split('\n').length - 1 && (
                                  <br />
                                )}
                              </span>
                            ))}
                          </h2>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="absolute bottom-[11px] left-[20px] h-[50px] w-[270px]">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-[50px] w-[50px] rounded-full border border-white bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none"
                              onClick={() => toggleLike(index)}
                            >
                              <HeartIcon
                                className="h-5 w-5"
                                color="#ffffff"
                                active={
                                  index >= 0 && index < likedRecipes.length
                                    ? likedRecipes[index]
                                    : false
                                }
                              />
                            </Button>
                            <Button className="h-[50px] flex-1 rounded-full bg-white text-gray-900">
                              <CookIcon
                                className="mr-2 h-[18px] w-[18px]"
                                color="#212529"
                              />
                              <span className="text-17sb">
                                이 레시피 해먹기
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 스낵바 메시지 */}
                  <div className="absolute top-[480px] left-0 h-[50px] w-[310px] rounded-[14px] bg-[#5a616d]/80 shadow-lg">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-15 text-white">
                        {snackbarMessage}
                      </span>
                    </div>
                  </div>
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
