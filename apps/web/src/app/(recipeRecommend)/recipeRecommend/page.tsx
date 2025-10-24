'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useEffect, useState } from 'react';
import { debugAuth } from '@recipot/api';
import axios from 'axios';
import { Swiper } from 'swiper/react';

import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import { useCookStateStepData } from '@/stores/onboardingStore';
import type { Condition, ConditionsResponse } from '@/types/recipe.types';

import RecipeHeader from './_components/RecipeHeader';
import RecipeTitle from './_components/RecipeTitle';
import { SWIPER_CONFIG, SWIPER_MODULES, swiperStyles } from '../constants';

export default function RecipeRecommend() {
  const [token, setToken] = useState<string | null>(null);
  // const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());
  // const [isLoading, setIsLoading] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(0);
  const [currentCondition, setCurrentCondition] = useState<Condition | null>(
    null
  );
  const { isVisible, message, showToast } = useToast();

  // 온보딩에서 저장된 사용자의 기분 상태 가져오기
  const cookStateData = useCookStateStepData();
  const userSelectedMood = cookStateData?.mood ?? 'neutral';

  // const token = tokenUtils.getToken();

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
    const getToken = async () => {
      try {
        const res = await debugAuth.generateDebugToken({
          role: 'user',
          userId: 1,
        });
        setToken(res.accessToken);
      } catch (error) {
        console.error('초기 토큰 생성 실패:', error);
      }
    };
    getToken();
  }, []);

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

  // 하트 아이콘 클릭 시 북마크 토글 함수
  // const handleToggleBookmark = async (recipeId: number) => {
  //   if (isLoading) return;

  //   setIsLoading(true);
  //   const bookmarkURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/bookmarks`;
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   const isCurrentlyLiked = likedRecipes.has(recipeId);

  //   try {
  //     if (isCurrentlyLiked) {
  //       // DELETE 요청
  //       await axios.delete(`${bookmarkURL}/${recipeId}`, config);
  //       setLikedRecipes(prev => {
  //         const newSet = new Set(prev);
  //         newSet.delete(recipeId);
  //         return newSet;
  //       });
  //       setToastIcon('heart');
  //       showToast('북마크에서 제거했어요');
  //     } else {
  //       // POST 요청
  //       await axios.post(bookmarkURL, { recipeId }, config);
  //       setLikedRecipes(prev => new Set(prev).add(recipeId));
  //       setToastIcon('heart');
  //       showToast('레시피를 북마크에 추가했어요');
  //     }
  //   } catch (error: unknown) {
  //     console.error('북마크 토글 실패:', error);
  //     setToastIcon('heart');
  //     showToast(
  //       isCurrentlyLiked
  //         ? '북마크 제거에 실패했어요'
  //         : '북마크 추가에 실패했어요'
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleRefresh = () => {
    // refetch();
    setToastIcon('recipe');
    showToast('새로운 레시피가 추천되었어요');
  };

  // 이미지 사전 로딩
  // useEffect(() => {
  //   if (data?.recipes?.length && data.recipes.length > 0) {
  //     // 현재 카드와 다음 2개 카드의 이미지를 미리 로딩
  //     const preloadImages = data.recipes.slice(activeIndex, activeIndex + 3);
  //     preloadImages.forEach(recipe => {
  //       const img = new Image();
  //       img.src = recipe.images[0].imageUrl;
  //     });
  //   }
  // }, [activeIndex, data?.recipes]);

  return (
    // TODO : 추후 감정 상태에 따라 그래디언트 적용 필요
    <>
      <RecipeHeader onRefresh={handleRefresh} />
      <Header.Spacer />
      <div className="recipe-recommend-main flex flex-col items-center justify-center overflow-hidden">
        {/* Swiper Cards Effect - 남은 공간 차지 */}
        <div className="px-6 pt-5 pb-6">
          <div className="recipe-header-group mb-5">
            {/* Tags - 고정 높이 */}
            {/* <RecipeTags selectedIngredients={selectedIngredients} /> */}

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
                // onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
              >
                {/* {data?.recipes?.map((recipe, index) => (
                  <SwiperSlide
                    key={recipe.id}
                    className="flex items-center justify-center"
                  >
                    <RecipeCard
                      recipe={recipe}
                      index={index}
                      onToggleLike={() => handleToggleBookmark(recipe.id)}
                      isLiked={likedRecipes.has(recipe.id)}
                      isMainCard={index === activeIndex}
                    />
                  </SwiperSlide>
                ))} */}
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
