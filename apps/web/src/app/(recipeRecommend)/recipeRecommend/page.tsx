'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { tokenUtils } from 'packages/api/src/auth';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import {
  fetchRecipeRecommend,
  useRecipeRecommend,
} from '@/hooks/useRecipeRecommend';
import { useToast } from '@/hooks/useToast';
import { useCookStateStepData } from '@/stores/onboardingStore';
import type { Condition, ConditionsResponse } from '@/types/recipe.types';

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
  const [currentCondition, setCurrentCondition] = useState<Condition | null>(
    null
  );
  const { isVisible, message, showToast } = useToast();

  // 온보딩에서 저장된 사용자의 기분 상태 가져오기
  const cookStateData = useCookStateStepData();
  const userSelectedMood = cookStateData?.mood;

  // TanStack Query로 레시피 데이터 조회
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { selectedIngredients } = useRecipeRecommend();

  const token = tokenUtils.getToken();

  // 토스트 상태 관리
  const [toastIcon, setToastIcon] = useState<'heart' | 'recipe'>('recipe');

  // 사용자 기분 상태에 따른 조건 매핑
  const getConditionByMood = (
    mood: string | undefined,
    conditions: Condition[]
  ): Condition | null => {
    if (!mood || conditions.length === 0) return null;

    // 기분 상태에 따른 조건 매핑
    const moodToConditionMap: Record<string, string> = {
      bad: '힘들어',
      good: '충분해',
      neutral: '그럭저럭',
    };

    const targetConditionName = moodToConditionMap[mood];
    if (!targetConditionName) return null;

    // 조건 목록에서 해당하는 조건 찾기
    return (
      conditions.find(condition => condition.name === targetConditionName) ??
      null
    );
  };

  useEffect(() => {
    const getCondition = async () => {
      try {
        const { data } = await axios.get<ConditionsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/conditions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 사용자가 선택한 기분 상태에 따라 조건 설정
        const userCondition = getConditionByMood(
          userSelectedMood,
          data.data.conditions
        );
        setCurrentCondition(userCondition);
      } catch (error) {
        console.error('조건 조회 실패:', error);
      }
    };
    getCondition();
  }, [token, userSelectedMood]);

  // 하트 아이콘 클릭 시 토스트 표시를 위한 래퍼 함수
  const handleToggleLike = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/bookmarks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res, 'res');
  };

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
    <>
      <RecipeHeader onRefresh={handleRefresh} />
      <div className="recipe-recommend-main flex flex-col items-center justify-center overflow-hidden pt-14">
        {/* Header - 고정 높이 */}

        {/* Swiper Cards Effect - 남은 공간 차지 */}
        <div className="px-6 pt-5 pb-6">
          <div className="recipe-header-group mb-5">
            {/* Tags - 고정 높이 */}
            <RecipeTags selectedIngredients={selectedIngredients} />

            {/* Title - 고정 높이 */}
            <RecipeTitle condition={currentCondition} />
          </div>

          <div className="flex h-full w-full flex-col items-center">
            {/* 반응형 컨테이너 - 화면에 맞춰 축소 */}
            <div className="recipe-card-wrapper relative w-full max-w-[310px]">
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
                      onToggleLike={handleToggleLike}
                      isMainCard={index === activeIndex}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Page Indicator - 카드 바로 아래 */}
            <div className="recipe-pagination mt-4 flex justify-center gap-1.5" />
          </div>
        </div>

        {/* 전역 토스트 */}
      </div>
      <Toast message={message} isVisible={isVisible} icon={toastIcon} />
    </>
  );
}
