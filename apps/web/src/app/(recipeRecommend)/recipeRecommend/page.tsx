'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';
import '@/components/EmotionState/styles.css';

import React, { useEffect, useMemo, useState } from 'react';
import { recipe, storedAPI } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';
import { Swiper, SwiperSlide } from 'swiper/react';

import { moodToConditionId } from '@/app/onboarding/_utils/conditionMapper';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import { useToast } from '@/hooks/useToast';
import { isProduction } from '@/lib/env';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import type { Recipe, RecommendationItem } from '@/types/recipe.types';
import { getEmotionGradient } from '@/utils/emotionGradient';

import RecipeHeader from './_components/RecipeHeader';
import RecipeTags from './_components/RecipeTags';
import RecipeTitle from './_components/RecipeTitle';
import TutorialPopup from './_components/TutorialPopup';
import { SWIPER_CONFIG, SWIPER_MODULES, swiperStyles } from '../constants';

// localStorage 키 상수
const TUTORIAL_CLOSED_KEY = 'recipe-recommend-tutorial-closed';

export default function RecipeRecommend() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const [likedRecipes, setLikedRecipes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { isVisible, message, showToast } = useToast();

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push('/signin');
    }
  }, [loading, user, router]);

  // 온보딩에서 저장된 사용자의 기분 상태 가져오기
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  const userSelectedMood = mood ?? 'neutral';

  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  // condition 객체를 useMemo로 메모이제이션
  const condition = useMemo(
    () => ({
      id: moodToConditionId(userSelectedMood),
      name: userSelectedMood,
    }),
    [userSelectedMood]
  );

  const [showTutorial, setShowTutorial] = useState(false);

  // API 응답을 Recipe 타입으로 변환하는 함수
  const mapRecommendationToRecipe = (
    item: RecommendationItem
  ): Omit<Recipe, 'ingredients'> => {
    const {
      description,
      duration,
      imageUrls,
      isBookmarked,
      recipeId,
      title,
      tools,
    } = item;

    return {
      description,
      duration,
      id: recipeId,
      images: imageUrls.map((url, index) => ({
        id: index + 1,
        imageUrl: url,
      })),
      isBookmarked,
      title,
      tools: tools.map((toolName, index) => ({
        id: index + 1,
        name: toolName,
      })),
    };
  };

  // 레시피 추천 API 호출 공통 함수
  const fetchRecommendRecipes = async () => {
    try {
      // selectedFoodIds가 비어있으면 API 호출하지 않음
      if (selectedFoodIds?.length === 0) {
        console.warn('선택된 재료가 없어서 레시피 추천을 건너뜁니다.');
        return;
      }

      const conditionId = moodToConditionId(userSelectedMood);

      const { data } = await recipe.recipeRecommend(
        conditionId,
        selectedFoodIds
      );

      // API 응답에서 items 추출
      const { items } = data;

      // API 응답을 Recipe 타입으로 변환
      const mappedRecipes = items.map(mapRecommendationToRecipe);
      setRecipes(mappedRecipes);

      // 초기 북마크 상태 설정
      const bookmarkedRecipe = mappedRecipes.filter(
        (recipe: Recipe) => recipe.isBookmarked
      );

      const bookmarkedIds = new Set<number>(
        bookmarkedRecipe.map((recipe: Recipe) => recipe.id)
      );

      setLikedRecipes(bookmarkedIds);
    } catch (error) {
      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showToast('인증 오류, 로그인 페이지로 이동합니다', 3000);
        router.push('/signin');
        return;
      }
      showToast('레시피를 불러오는데 실패했어요');
    }
  };

  useEffect(() => {
    fetchRecommendRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedMood, selectedFoodIds]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = await recipe.getMyProfile();

        // localStorage 확인 - 이미 튜토리얼을 닫은 적이 있는지 체크
        const tutorialClosed = localStorage.getItem(TUTORIAL_CLOSED_KEY);

        // 첫 진입이고, 아직 튜토리얼을 닫은 적이 없을 때만 표시
        if (userInfo.isFirstEntry && !tutorialClosed) {
          setShowTutorial(true);
        }
      } catch (error) {
        showToast('프로필 조회 실패', 3000);
        // 인증 오류인 경우 로그인 페이지로 리다이렉트
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          showToast('인증 오류, 로그인 페이지로 이동합니다', 3000);
          router.push('/signin');
          return;
        }
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // 하트 아이콘 클릭 시 북마크 토글 함수
  const handleToggleBookmark = async (_index: number, recipeId: number) => {
    if (isLoading) return;

    setIsLoading(true);
    if (!useCookieAuth && !token) {
      showToast('인증 토큰이 없어 북마크를 변경할 수 없습니다', 3000);
      router.push('/signin');
      setIsLoading(false);
      return;
    }

    const isCurrentlyLiked = likedRecipes.has(recipeId);

    try {
      if (isCurrentlyLiked) {
        // DELETE 요청
        await storedAPI.deleteStoredRecipe(recipeId);
        setLikedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // POST 요청
        await storedAPI.postStoredRecipe(recipeId);
        setLikedRecipes(prev => new Set(prev).add(recipeId));

        showToast('레시피가 저장되었어요!');
      }
    } catch (error: unknown) {
      showToast('북마크 토글 실패', 3000);
      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showToast('인증 오류, 로그인 페이지로 이동합니다', 3000);
        router.push('/signin');
        return;
      }
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
    // localStorage에 튜토리얼 닫음 플래그 저장
    localStorage.setItem(TUTORIAL_CLOSED_KEY, 'true');
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

  // 로딩 중이거나 비로그인 사용자인 경우 빈 화면 표시
  if (loading || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <RecipeHeader onRefresh={handleRefresh} />
      <Header.Spacer />
      <div
        className={`recipe-recommend-main flex flex-col items-center justify-center overflow-hidden ${getEmotionGradient(userSelectedMood)}`}
      >
        {/* Swiper Cards Effect - 남은 공간 차지 */}
        <div className="px-6 pb-6">
          <div className="recipe-header-group mb-5">
            {/* Tags - 고정 높이 */}
            <RecipeTags />

            {/* Title - 고정 높이 */}
            <RecipeTitle condition={condition} />
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
    </div>
  );
}
