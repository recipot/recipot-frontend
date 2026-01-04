'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import DietaryRestrictionsSheet from '@/app/mypage/_components/DietaryRestrictionsSheet';
import {
  getEmojiByConditionId,
  moodToConditionId,
} from '@/app/onboarding/_utils';
import { Button } from '@/components/common/Button';
import { EmotionBackground, type MoodType } from '@/components/EmotionState';
import { RecipeCard } from '@/components/RecipeCard';
import { useToastContext } from '@/contexts/ToastContext';
import { useFoodList } from '@/hooks/useFoodList';
import { useRecipeRecommend } from '@/hooks/useRecipeRecommend';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { CONDITION_STATUS } from '../../_constants';
import { ABCardContainer, ABStepIndicator } from '..';

import type { CONDITION_TITLES } from '../../_constants';
import type { Swiper as SwiperType } from 'swiper';

const SWIPER_MODULES = [EffectCards, Pagination];

const SWIPER_CONFIG = {
  cardsEffect: {
    perSlideOffset: 7,
    perSlideRotate: 3,
    rotate: true,
    slideShadows: false,
  },
  effect: 'cards' as const,
  grabCursor: true,
  pagination: {
    clickable: true,
    el: '.recipe-pagination-ab',
  },
};

interface RecipeResultStepProps {
  onStepClick?: (step: number) => void;
}

/**
 * A/B 테스트 B안 Step 3: 레시피 추천 결과
 * 선택한 컨디션과 재료를 기반으로 레시피를 추천합니다.
 */
export default function RecipeResultStep({
  onStepClick,
}: RecipeResultStepProps) {
  const { showToast } = useToastContext();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastFetchKeyRef = useRef<string | null>(null);
  const [isRestrictionsSheetOpen, setIsRestrictionsSheetOpen] = useState(false);

  // 저장된 상태 가져오기
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);
  const { data: foodList = [] } = useFoodList();

  const userSelectedMood: MoodType = mood ?? 'neutral';
  const moodKey = userSelectedMood as keyof typeof CONDITION_TITLES;

  // 레시피 추천 훅
  const { fetchRecipes, hasFetched, isLoading, recipes, updateRecipeBookmark } =
    useRecipeRecommend({
      enabled: true,
      selectedFoodIds,
      showToast,
      userSelectedMood,
    });

  // 조건 변경 시 레시피 조회
  useEffect(() => {
    if (!Array.isArray(selectedFoodIds) || selectedFoodIds.length === 0) {
      lastFetchKeyRef.current = null;
      return;
    }

    const fetchKey = `${userSelectedMood}:${selectedFoodIds.join(',')}`;

    if (lastFetchKeyRef.current === fetchKey) {
      return;
    }

    lastFetchKeyRef.current = fetchKey;
    fetchRecipes(1);
  }, [selectedFoodIds, userSelectedMood, fetchRecipes]);

  // 선택된 재료 이름 목록
  const selectedFoodNames = useMemo(() => {
    return selectedFoodIds
      .map(id => foodList.find(food => food.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  }, [selectedFoodIds, foodList]);

  // 북마크 변경 핸들러
  const handleBookmarkChange = (recipeId: number, isBookmarked: boolean) => {
    updateRecipeBookmark(recipeId, isBookmarked);
  };

  // 메뉴 추천받기 버튼 클릭 - 못 먹는 재료 선택 시트 열기
  const handleGetRecommendation = () => {
    setIsRestrictionsSheetOpen(true);
  };

  // 못 먹는 재료 선택 완료 후 처리
  const handleRestrictionsClose = () => {
    setIsRestrictionsSheetOpen(false);
  };

  // 못 먹는 재료 저장 후 처리

  const conditionId = moodToConditionId(userSelectedMood);
  const statusText = CONDITION_STATUS[moodKey];
  const emoji = getEmojiByConditionId(conditionId);

  return (
    <div className="flex flex-col bg-transparent">
      {/* 배경 그래디언트 - 컨디션에 따라 변경 */}
      <EmotionBackground
        mood={userSelectedMood}
        className="fixed inset-0 -z-10"
      />

      {/* 상단 헤더 영역 */}
      <div className="flex flex-col items-center px-4 pt-6 pb-8">
        <ABStepIndicator currentStep={3} onStepClick={onStepClick} />
      </div>

      {/* 카드 컨테이너 */}
      <ABCardContainer>
        {/* 선택된 재료 태그 */}
        <div className="mt-[70px] flex flex-wrap justify-center gap-[6px]">
          {selectedFoodNames.map(name => (
            <div
              key={name}
              className="bg-secondary-light-green border-secondary-soft-green rounded-[6px] border px-3 py-[3px] text-[#53880A]"
            >
              <span className="text-14b whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>

        {/* 상태 텍스트 */}
        <div className="mb-5 flex items-center justify-center">
          <h2 className="text-22 mr-[2px]">{statusText}</h2>
          <span className="text-2xl">{emoji}</span>
        </div>

        {/* 레시피 카드 영역 */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-gray-600">레시피를 찾고 있어요...</p>
            </div>
          ) : hasFetched && recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <p className="text-18 text-center text-gray-600">
                조건에 맞는 레시피가 없어요 😢
              </p>
              <p className="text-14 text-center text-gray-500">
                다른 재료를 선택해보세요
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-[310px]">
              <Swiper
                modules={SWIPER_MODULES}
                {...SWIPER_CONFIG}
                className="recipe-swiper h-full w-full"
                onSwiper={swiper => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
              >
                {recipes?.map((recipe, index) => (
                  <SwiperSlide
                    key={recipe.id}
                    className="flex items-center justify-center"
                  >
                    <RecipeCard
                      recipe={recipe}
                      index={index}
                      onBookmarkChange={handleBookmarkChange}
                      isBookmarked={recipe.isBookmarked}
                      isMainCard={index === activeIndex}
                      mood={userSelectedMood}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="mt-[30px]">
          <Button
            size="full"
            onClick={handleGetRecommendation}
            disabled={isLoading || recipes.length === 0}
          >
            메뉴 추천받기
          </Button>
        </div>
      </ABCardContainer>

      {/* 못 먹는 재료 선택 시트 */}
      <DietaryRestrictionsSheet
        isOpen={isRestrictionsSheetOpen}
        onClose={handleRestrictionsClose}
      />
    </div>
  );
}
