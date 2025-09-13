import React from 'react';
import { ChefHat, Clock } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { CookIcon, HeartIcon } from '@/components/Icons';
import type { Recipe } from '@/types/recipe.types';

const gradientStyle = {
  background:
    'linear-gradient(180deg, rgba(84, 114, 178, 0) 5.38%, rgba(84, 114, 178, 0.8) 28.90%, #5472b2 40.40%, #5472b2 100%)',
};

const getBackgroundColor = (index: number) => {
  const colors = ['#d1d9f0', '#b8c4e8', '#9fb0e0', '#f0f3fc'];
  return colors[index % 4];
};

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isLiked: boolean;
  snackbarMessage: string;
  onToggleLike: (index: number, recipeId: number) => void;
  isMainCard?: boolean;
}

export const RecipeCard = ({
  index,
  isLiked,
  isMainCard = false,
  onToggleLike,
  recipe,
  // snackbarMessage,
}: RecipeCardProps) => {
  return (
    <div className="relative h-[460px] w-[310px]">
      {/* 메인 카드 - card-front */}
      <div className="relative z-10 h-[460px] w-[310px] overflow-hidden rounded-[32px] bg-white">
        {/* 이미지 영역 - 메인 카드만 이미지 표시 */}
        <div className="absolute top-0 left-0 h-[386px] w-[310px]">
          {isMainCard ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={310}
              height={386}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ backgroundColor: getBackgroundColor(index) }}
            />
          )}
        </div>

        {/* 조리 시간과 조리도구 - 메인 카드만 표시 */}
        {isMainCard && (
          <div className="absolute top-[20px] left-[20px] h-[32px] w-[270px]">
            <div className="flex gap-2">
              <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
                <Clock className="h-[18px] w-[18px] text-white" />
                <span className="text-17 text-white">{recipe.time}</span>
              </div>
              <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
                <ChefHat className="h-[18px] w-[18px] text-white" />
                <span className="text-17 text-white">{recipe.cookware}</span>
              </div>
            </div>
          </div>
        )}

        {/* 하단 영역 - 메인 카드만 그래디언트와 텍스트, 버튼 표시 */}
        {isMainCard ? (
          <div
            className="absolute bottom-0 left-0 h-[244px] w-[310px]"
            style={gradientStyle}
          >
            {/* 텍스트 영역 */}
            <div className="absolute top-[40px] left-[20px] h-[104px] w-[270px]">
              <p className="text-17 mb-2 line-clamp-1 text-white opacity-90">
                {recipe.subtitle}
              </p>
              <h2 className="text-24 line-clamp-2 text-white">
                {recipe.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < recipe.title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h2>
            </div>

            {/* 버튼 영역 - Figma 정확한 레이아웃 */}
            <div className="absolute bottom-[11px] left-[20px] h-[52px] w-[270px]">
              <div className="flex gap-2">
                {/* 하트 버튼 - Figma 정확한 크기 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[52px] w-[52px] rounded-full border border-white bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none"
                  onClick={() => onToggleLike(index, recipe.id)}
                >
                  <HeartIcon
                    className="h-5 w-5"
                    color="#ffffff"
                    active={isLiked}
                  />
                </Button>
                {/* 요리하러 가기 버튼 - Figma 정확한 크기 */}
                <Button className="h-[52px] w-[210px] rounded-full bg-white text-gray-900">
                  <CookIcon
                    className="mr-2 h-[18px] w-[18px]"
                    color="#212529"
                  />
                  <span className="text-17sb">요리하러 가기</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="absolute bottom-0 left-0 h-[244px] w-[310px]"
            style={{ backgroundColor: getBackgroundColor(index) }}
          />
        )}
      </div>

      {/* 스낵바 메시지 */}
      {/* {snackbarMessage && (
        <div className="absolute top-[480px] left-0 h-[50px] w-[310px] rounded-[14px] bg-[#5a616d]/80 shadow-lg">
          <div className="flex h-full items-center justify-center">
            <span className="text-15 text-white">{snackbarMessage}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

RecipeCard.displayName = 'RecipeCard';
