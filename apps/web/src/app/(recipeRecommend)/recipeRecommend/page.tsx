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

import berryPopsicle from '/public/backgroundImage.jpg';

// Carousel 설정
const carouselOpts = {
  align: 'center' as const,
  loop: false,
};

// 레시피 데이터
const recipeData = [
  {
    cookware: '프라이팬 +2',
    id: 1,
    image: berryPopsicle,
    subtitle: '레시피 타이틀 최대 1줄까지',
    time: '99분',
    title: '빵 한장에 땅콩버터 바르고\n사과만 없으면 똑딱',
  },
  {
    cookware: '프라이팬',
    id: 2,
    image: berryPopsicle,
    subtitle: '간단한 한끼',
    time: '5분',
    title: '김치볶음밥\n5분이면 완성!',
  },
  {
    cookware: '냄비',
    id: 3,
    image: berryPopsicle,
    subtitle: '전통 한식',
    time: '15분',
    title: '고사리나물\n밥도둑 레시피',
  },
];

export default function RecipeRecommend() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(recipeData.length);
  const [likedRecipes, setLikedRecipes] = useState<boolean[]>(
    new Array(recipeData.length).fill(false)
  );

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const toggleLike = (index: number) => {
    setLikedRecipes(prev => {
      const newLikes = [...prev];
      // TODO : 추후 API 연결하면서 로직 수정
      newLikes[index] = !newLikes[index];
      return newLikes;
    });
  };

  return (
    <>
      {/* Header */}
      <div className="container mx-auto mt-8 px-4 sm:mt-12 sm:px-6 md:mt-[62px] lg:px-8">
        <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
          <BackIcon />
          <RefreshIcon />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          <div className="bg-secondary-light-green text-12b sm:text-14b text-secondary-pressed rounded-full px-2 py-[2px] sm:px-3 sm:py-[3px]">
            고사리
          </div>
          <div className="bg-secondary-light-green text-12b sm:text-14b text-secondary-pressed rounded-full px-2 py-[2px] sm:px-3 sm:py-[3px]">
            김치
          </div>
          <div className="bg-secondary-light-green text-12b sm:text-14b text-secondary-pressed rounded-full px-2 py-[2px] sm:px-3 sm:py-[3px]">
            땅콩버터
          </div>
          <div className="bg-secondary-light-green text-12b sm:text-14b text-secondary-pressed rounded-full px-2 py-[2px] sm:px-3 sm:py-[3px]">
            +5
          </div>
        </div>
      </div>

      {/* Title */}
      <p className="text-18 sm:text-20 md:text-22 mt-4 px-4 text-center sm:px-6 lg:px-8">
        요리할 여유가 거의...없어요
      </p>

      {/* 슬라이드 카드 */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* 네비게이션 화살표 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/90 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:left-4 sm:h-10 sm:w-10"
            disabled={current === 1}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white/90 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:right-4 sm:h-10 sm:w-10"
            disabled={current === count}
          />

          <Carousel
            setApi={setApi}
            className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg"
            opts={carouselOpts}
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {recipeData.map((recipe, index) => (
                <CarouselItem key={recipe.id} className="pl-2 sm:pl-4">
                  <div className="hover:shadow-3xl relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] sm:rounded-3xl">
                    <div className="absolute inset-0">
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        width={310}
                        height={386}
                        className="h-full w-full object-cover"
                      />
                      {/* 그라데이션 오버레이 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="text-primary-foreground relative z-10 flex h-[320px] flex-col justify-between p-4 sm:h-[350px] sm:p-6 md:h-[386px]">
                      <div className="mb-4 flex flex-wrap gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/40 sm:px-3">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-14b sm:text-17sb">
                            {recipe.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/40 sm:px-3">
                          <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-14b sm:text-17sb">
                            {recipe.cookware}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <p className="mb-2 text-xs opacity-90 sm:text-sm">
                          {recipe.subtitle}
                        </p>
                        <h2 className="mb-4 text-lg leading-tight font-bold sm:mb-6 sm:text-xl">
                          {recipe.title.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < recipe.title.split('\n').length - 1 && (
                                <br />
                              )}
                            </span>
                          ))}
                        </h2>

                        <div className="flex gap-2 sm:gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 hover:shadow-lg sm:h-12 sm:w-12"
                            onClick={() => toggleLike(index)}
                          >
                            <HeartIcon
                              className="h-4 w-4 transition-all duration-300 sm:h-5 sm:w-5"
                              color="#ffffff"
                              active={likedRecipes[index]}
                            />
                          </Button>
                          <Button className="text-14 sm:text-17 h-10 flex-1 rounded-full bg-white text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl sm:h-12">
                            <CookIcon
                              className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110 sm:mr-2 sm:h-4 sm:w-4"
                              color="#212529"
                            />
                            <span className="text-17sb">요리하러 가기</span>
                          </Button>
                        </div>
                      </div>
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
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 hover:scale-125 sm:h-2 sm:w-2 ${
                i === current - 1
                  ? 'scale-125 bg-gray-900 shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-400'
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
