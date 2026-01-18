'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import {
  A_CONDITION_STATUS,
  type A_CONDITION_TITLES,
} from '@/app/ab-test/_constants';
import {
  getEmojiByConditionId,
  moodToConditionId,
} from '@/app/onboarding/_utils';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { type MoodType } from '@/components/EmotionState';
import { RecipeCard } from '@/components/RecipeCard';
import { useToastContext } from '@/contexts/ToastContext';
import { useFoodList } from '@/hooks/useFoodList';
import { useRecipeRecommend } from '@/hooks/useRecipeRecommend';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import { getEmotionGradient } from '@/utils/emotionGradient';

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
    el: '.ab-intro-pagination',
  },
};

const swiperStyles = {
  '--swiper-pagination-bottom': '0px',
} as React.CSSProperties;

const MAX_VISIBLE_TAGS = 3;

interface RecipeResultStepProps {
  onStepClick?: (step: number) => void;
}

/**
 * A/B 테스트 B안 : 레시피 추천 결과
 * 선택한 컨디션과 재료를 기반으로 레시피를 추천합니다.
 */
export default function RecipeResultStep({
  onStepClick,
}: RecipeResultStepProps) {
  const { showToast } = useToastContext();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastFetchKeyRef = useRef<string | null>(null);

  // 저장된 상태 가져오기
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);
  const { data: foodList = [] } = useFoodList();

  const userSelectedMood: MoodType = mood ?? 'neutral';
  const moodKey = userSelectedMood as keyof typeof A_CONDITION_TITLES;

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

  // 표시할 재료 태그 (최대 3개 + 나머지 개수)
  const displayedTags = useMemo(() => {
    const visibleTags = selectedFoodNames.slice(0, MAX_VISIBLE_TAGS);
    const remainingCount = selectedFoodNames.length - MAX_VISIBLE_TAGS;

    return {
      hasMore: remainingCount > 0,
      remainingCount,
      tags: visibleTags,
    };
  }, [selectedFoodNames]);

  const transformedRecipes = useMemo(() => {
    return recipes.map(recipe => {
      const recipeData = recipe as any;

      return {
        ...recipe,
        id: recipeData.recipeId ?? recipe.id,
        images: recipeData.imageUrls
          ? recipeData.imageUrls.map((url: string) => ({ imageUrl: url }))
          : recipe.images || [],
      };
    });
  }, [recipes]);

  // 북마크 변경 핸들러
  const handleBookmarkChange = (recipeId: number, isBookmarked: boolean) => {
    updateRecipeBookmark(recipeId, isBookmarked);
  };

  // 메뉴 추천받기 버튼 클릭 - 못 먹는 재료 선택 페이지로 이동
  const handleGetRecommendation = () => {
    onStepClick?.(0);
  };

  // 이미지 사전 로딩
  useEffect(() => {
    if (transformedRecipes.length > 0) {
      transformedRecipes.slice(activeIndex, activeIndex + 3).forEach(recipe => {
        if (recipe.images?.[0]?.imageUrl) {
          const img = new Image();
          img.src = recipe.images[0].imageUrl;
        }
      });
    }
  }, [activeIndex, transformedRecipes]);

  const conditionId = moodToConditionId(userSelectedMood);
  const statusText = A_CONDITION_STATUS[moodKey];
  const emoji = getEmojiByConditionId(conditionId);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 상단 헤더 영역 */}
      <RecipeHeader />
      <Header.Spacer />

      {/* 메인 컨텐츠 영역 */}
      <div
        className={`recipe-recommend-main flex min-h-0 flex-1 flex-col items-center justify-center ${getEmotionGradient(
          userSelectedMood
        )}`}
      >
        {/* 선택된 재료 태그 */}
        <div className="mt-6 mb-4 flex shrink-0 flex-wrap justify-center gap-[6px] px-6">
          {displayedTags.tags.map(name => (
            <div
              key={name}
              className="bg-secondary-light-green border-secondary-soft-green rounded-[6px] border px-3 py-[3px] text-[#53880A]"
            >
              <span className="text-14b whitespace-nowrap">{name}</span>
            </div>
          ))}
          {displayedTags.hasMore && (
            <div className="bg-secondary-light-green border-secondary-soft-green rounded-[6px] border px-3 py-[3px] text-[#53880A]">
              <span className="text-14b whitespace-nowrap">
                +{displayedTags.remainingCount}
              </span>
            </div>
          )}
        </div>

        {/* 상태 텍스트 */}
        <div className="mb-10 flex shrink-0 items-center justify-center">
          <h2 className="text-22 mr-[2px]">{statusText}</h2>
          <span className="text-2xl">{emoji}</span>
        </div>

        {/* 레시피 카드 영역 */}
        <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-gray-600">레시피를 찾고 있어요...</p>
            </div>
          ) : hasFetched && transformedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <p className="text-18 text-center text-gray-600">
                조건에 맞는 레시피가 없어요 😢
              </p>
              <p className="text-14 text-center text-gray-500">
                다른 재료를 선택해보세요
              </p>
              <Button
                size="full"
                onClick={handleGetRecommendation}
                className="mt-4"
              >
                메뉴 추천받기
              </Button>
            </div>
          ) : (
            <div className="flex h-[460px] w-[310px] flex-col items-center justify-center">
              <div
                className="recipe-card-wrapper relative w-full max-w-[310px]"
                style={{ height: '100%', maxHeight: '600px' }}
              >
                <Swiper
                  modules={SWIPER_MODULES}
                  {...SWIPER_CONFIG}
                  className="recipe-swiper h-full w-full"
                  style={swiperStyles}
                  onSwiper={swiper => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                >
                  {transformedRecipes?.map((recipe, index) => (
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
              {/* 페이지네이션 */}
              <div className="ab-intro-pagination mt-5 flex justify-center" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
