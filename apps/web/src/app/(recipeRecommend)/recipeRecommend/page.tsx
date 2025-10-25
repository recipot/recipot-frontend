'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { tokenUtils } from 'packages/api/src/auth';
import { Swiper, SwiperSlide } from 'swiper/react';

import { moodToConditionId } from '@/app/onboarding/_utils/conditionMapper';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import { useToast } from '@/hooks/useToast';
import { useCookStateStepData } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import type {
  Recipe,
  RecommendationItem,
  RecommendationResponse,
} from '@/types/recipe.types';

import RecipeHeader from './_components/RecipeHeader';
import RecipeTags from './_components/RecipeTags';
import RecipeTitle from './_components/RecipeTitle';
import TutorialPopup from './_components/TutorialPopup';
import { SWIPER_CONFIG, SWIPER_MODULES, swiperStyles } from '../constants';

export default function RecipeRecommend() {
  const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { isVisible, message, showToast } = useToast();

  // 온보딩에서 저장된 사용자의 기분 상태 가져오기
  const cookStateData = useCookStateStepData();
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  const userSelectedMood = cookStateData?.mood ?? 'neutral';

  const token = tokenUtils.getToken();

  const [showTutorial, setShowTutorial] = useState(false);

  // API 응답을 Recipe 타입으로 변환하는 함수
  const mapRecommendationToRecipe = (
    item: RecommendationItem
  ): Omit<Recipe, 'ingredients'> => {
    return {
      description: item.description,
      duration: parseInt(item.duration),
      id: item.recipeId,
      images: item.imageUrls.map((url, index) => ({
        id: index + 1,
        imageUrl: url,
      })),
      isBookmarked: item.isBookmarked,
      title: item.title,
      tools: item.tools.map((toolName, index) => ({
        id: index + 1,
        name: toolName,
      })),
    };
  };

  // 레시피 추천 API 호출 공통 함수
  const fetchRecommendRecipes = useCallback(async () => {
    try {
      const conditionId = moodToConditionId(userSelectedMood);

      const {
        data: {
          data: { items },
        },
      } = await axios.post<RecommendationResponse>(
        `api/v1/recipes/recommendations`,
        {
          conditionId,
          pantryIds: selectedFoodIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // API 응답을 Recipe 타입으로 변환
      const mappedRecipes = items.map(mapRecommendationToRecipe);
      setRecipes(mappedRecipes);

      // 초기 북마크 상태 설정
      const bookmarkedRecipe = mappedRecipes.filter(
        recipe => recipe.isBookmarked
      );

      const bookmarkedIds = new Set(bookmarkedRecipe.map(recipe => recipe.id));

      setLikedRecipes(bookmarkedIds);
    } catch (error) {
      console.error('레시피 추천 조회 실패:', error);
    }
  }, [userSelectedMood, selectedFoodIds, token]);

  useEffect(() => {
    fetchRecommendRecipes();
  }, [fetchRecommendRecipes]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`api/v1/users/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userInfo = res.data.data;

        // 첫 진입 시 튜토리얼 표시
        if (userInfo.isFirstEntry) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };
    fetchProfile();
  }, [token]);

  // 하트 아이콘 클릭 시 북마크 토글 함수
  const handleToggleBookmark = async (index: number, recipeId: number) => {
    if (isLoading) return;

    setIsLoading(true);
    const bookmarkURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/bookmarks`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const isCurrentlyLiked = likedRecipes.has(recipeId);

    try {
      if (isCurrentlyLiked) {
        // DELETE 요청
        await axios.delete(`${bookmarkURL}/${recipeId}`, config);
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // POST 요청
        await axios.post(bookmarkURL, { recipeId }, config);
        setLikedRecipes(prev => new Set(prev).add(recipeId));

        showToast('레시피가 저장되었어요!');
      }
    } catch (error: unknown) {
      console.error('북마크 토글 실패:', error);
      showToast(
        isCurrentlyLiked
          ? '북마크 제거에 실패했어요'
          : '북마크 추가에 실패했어요'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchRecommendRecipes();
    showToast('새로운 레시피가 추천되었어요');
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  // 이미지 사전 로딩
  useEffect(() => {
    if (recipes?.length && recipes.length > 0) {
      // 현재 카드와 다음 2개 카드의 이미지를 미리 로딩
      const preloadImages = recipes.slice(activeIndex, activeIndex + 3);
      preloadImages.forEach(recipe => {
        const img = new Image();
        img.src = recipe.images[0].imageUrl;
      });
    }
  }, [activeIndex, recipes]);

  return (
    <>
      <RecipeHeader onRefresh={handleRefresh} />
      <Header.Spacer />
      <div className="recipe-recommend-main flex flex-col items-center justify-center overflow-hidden">
        {/* Swiper Cards Effect - 남은 공간 차지 */}
        <div className="px-6 pt-5 pb-6">
          <div className="recipe-header-group mb-5">
            {/* Tags - 고정 높이 */}
            <RecipeTags />

            {/* Title - 고정 높이 */}
            <RecipeTitle
              condition={{
                id: moodToConditionId(userSelectedMood),
                name: userSelectedMood,
              }}
            />
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
                {recipes?.map((recipe, index) => (
                  <SwiperSlide
                    key={recipe.id}
                    className="flex items-center justify-center"
                  >
                    <RecipeCard
                      recipe={recipe}
                      index={index}
                      onToggleLike={handleToggleBookmark}
                      isLiked={likedRecipes.has(recipe.id)}
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

      {/* 튜토리얼 팝업 */}
      {showTutorial && <TutorialPopup onClose={handleCloseTutorial} />}

      <Toast message={message} isVisible={isVisible} />
    </>
  );
}
