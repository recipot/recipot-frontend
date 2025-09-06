import React from 'react';
import { ChefHat, Clock } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { CookIcon, HeartIcon } from '@/components/Icons';
import type { Recipe } from '@/types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isLiked: boolean;
  snackbarMessage: string;
  onToggleLike: (index: number) => void;
}

export const RecipeCard = ({
  index,
  isLiked,
  onToggleLike,
  recipe,
  snackbarMessage,
}: RecipeCardProps) => {
  return (
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
              <span className="text-17 text-white">{recipe.time}</span>
            </div>
            <div className="flex h-[32px] items-center gap-1 rounded-[15px] bg-black/30 px-3">
              <ChefHat className="h-[18px] w-[18px] text-white" />
              <span className="text-17 text-white">{recipe.cookware}</span>
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
                  {i < recipe.title.split('\n').length - 1 && <br />}
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
                onClick={() => onToggleLike(index)}
              >
                <HeartIcon
                  className="h-5 w-5"
                  color="#ffffff"
                  active={isLiked}
                />
              </Button>
              <Button className="h-[50px] flex-1 rounded-full bg-white text-gray-900">
                <CookIcon className="mr-2 h-[18px] w-[18px]" color="#212529" />
                <span className="text-17sb">이 레시피 해먹기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 스낵바 메시지 */}
      <div className="absolute top-[480px] left-0 h-[50px] w-[310px] rounded-[14px] bg-[#5a616d]/80 shadow-lg">
        <div className="flex h-full items-center justify-center">
          <span className="text-15 text-white">{snackbarMessage}</span>
        </div>
      </div>
    </div>
  );
};

RecipeCard.displayName = 'RecipeCard';
