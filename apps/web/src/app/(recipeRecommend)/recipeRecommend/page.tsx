'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';
import '@/components/EmotionState/styles.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { guestSession } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';

import { moodToConditionId } from '@/app/onboarding/_utils/conditionMapper';
import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { Modal } from '@/components/common/Modal/Modal';
import { Toast } from '@/components/common/Toast';
import type { MoodType } from '@/components/EmotionState';
import { ExploreComplete } from '@/components/ExploreComplete';
import { RecipeCard } from '@/components/RecipeCard';
import { useToastContext } from '@/contexts/ToastContext';
import { useRecipeRecommend } from '@/hooks/useRecipeRecommend';
import { useTutorial } from '@/hooks/useTutorial';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
import { getEmotionGradient } from '@/utils/emotionGradient';

import RecipeHeader from './_components/RecipeHeader';
import RecipeTags from './_components/RecipeTags';
import RecipeTitle from './_components/RecipeTitle';
import TutorialPopup from './_components/TutorialPopup';
import { SWIPER_CONFIG, SWIPER_MODULES, swiperStyles } from '../constants';

import type { Swiper as SwiperType } from 'swiper';

export default function RecipeRecommend() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const { isVisible, message, showToast } = useToastContext();
  const swiperRef = useRef<SwiperType | null>(null);
  const lastFetchKeyRef = useRef<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasGuestSession, setHasGuestSession] = useState(false);

  // 인증 상태 확인 및 리다이렉트
  useEffect(() => {
    if (loading) {
      return;
    }

    // 게스트 세션 확인
    const guestSessionId = guestSession.getSessionId();
    if (guestSessionId) {
      setHasGuestSession(true);
      return;
    }

    if (!user) {
      router.push('/signin');
    }
  }, [loading, user, router]);

  // 온보딩에서 저장된 사용자의 기분 상태 가져오기
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);
  const userSelectedMood: MoodType = mood ?? 'neutral';
  const enabled = !loading && (!!user || hasGuestSession);

  // 레시피 추천 훅
  const {
    fetchRecipes,
    hasFetched,
    recipes,
    refreshRecipes,
    updateRecipeBookmark,
  } = useRecipeRecommend({
    enabled,
    selectedFoodIds,
    showToast,
    userSelectedMood,
  });

  // 조건 변경 시 레시피 조회
  useEffect(() => {
    if (!enabled) {
      return;
    }

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
  }, [selectedFoodIds, userSelectedMood, enabled, fetchRecipes]);

  // 북마크 변경 핸들러
  const handleBookmarkChange = (recipeId: number, isBookmarked: boolean) => {
    updateRecipeBookmark(recipeId, isBookmarked);
  };

  // 튜토리얼 훅
  const {
    closeBetaNotice,
    closeTutorial,
    handleBetaNoticeOpenChange,
    showBetaNotice,
    showTutorial,
  } = useTutorial({
    enabled: !loading && (!!user || hasGuestSession),
    hasRecipesAvailable: hasFetched && recipes.length > 0,
  });

  // condition 객체
  const condition = useMemo(
    () => ({
      id: moodToConditionId(userSelectedMood),
      name: userSelectedMood,
    }),
    [userSelectedMood]
  );

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 새로고침 시 첫 번째 슬라이드로 이동
    swiperRef.current?.slideTo(0);
    setActiveIndex(0);
    await refreshRecipes();
    showToast('새로운 레시피가 추천되었어요');
  };

  // 이미지 사전 로딩
  useEffect(() => {
    if (recipes.length > 0) {
      recipes.slice(activeIndex, activeIndex + 3).forEach(recipe => {
        if (recipe.images?.[0]?.imageUrl) {
          const img = new Image();
          img.src = recipe.images[0].imageUrl;
        }
      });
    }
  }, [activeIndex, recipes]);

  // 로딩 중이거나 인증되지 않은 사용자인 경우 빈 화면 표시
  if (loading || (!user && !hasGuestSession)) {
    return null;
  }

  // API 호출 완료 후 레시피가 빈 배열인 경우 탐험완료 컴포넌트 표시
  if (hasFetched && recipes.length === 0) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <ExploreComplete />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <RecipeHeader onRefresh={handleRefresh} />
      <Header.Spacer />

      {/* TODO: 베타 서비스 이후 제거 예정 */}
      <Modal
        open={showBetaNotice}
        onOpenChange={handleBetaNoticeOpenChange}
        title="베타 서비스 안내"
        description={
          "'한끼부터'에 와주셔서 고마워요 🐤\n지금 한끼부터는 유저분들의 식탁에 맞는 레시피를 열심히 채우는 중이에요.\n그래서 아직은, 찾으시는 레시피가 없을 수도 있어요.\n\n그 대신 원하는 메뉴나 갖고 있는 재료를 알려주시면, 최대한 24시간 이내에 딱 맞는 레시피를 골라 드릴게요.\n\n밥새에게 부탁해볼까요?"
        }
        contentGap={24}
        className="mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)]"
        textAlign="left"
        titleBlock
      >
        <div className="flex flex-col gap-3">
          <Button size="full" onClick={closeBetaNotice}>
            확인했어요!
          </Button>
        </div>
      </Modal>
      <div
        className={`recipe-recommend-main flex flex-col items-center justify-center ${getEmotionGradient(
          userSelectedMood
        )}`}
      >
        {/* Swiper Cards Effect - 남은 공간 차지 */}
        <RecipeTags />
        <RecipeTitle condition={condition} />
        <div className="size-full px-6 pb-6">
          {/* Title - 고정 높이 */}

          <div className="flex h-full w-full flex-col items-center">
            {/* 반응형 컨테이너 - 화면에 맞춰 축소 */}
            <div className="recipe-card-wrapper relative w-full max-w-[310px]">
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
            <div className="recipe-pagination mt-4 flex justify-center gap-1.5" />
          </div>
        </div>

        {/* 전역 토스트 */}
      </div>
      {/* Page Indicator - 카드 바로 아래 */}
      <Toast message={message} isVisible={isVisible} position="card-bottom" />

      {/* 튜토리얼 팝업 */}
      {showTutorial && <TutorialPopup onClose={closeTutorial} />}
    </div>
  );
}
