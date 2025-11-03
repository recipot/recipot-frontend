'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import './styles.css';
import '@/components/EmotionState/styles.css';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { recipe, storedAPI } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';
import { Swiper, SwiperSlide } from 'swiper/react';

import { moodToConditionId } from '@/app/onboarding/_utils/conditionMapper';
import type {
  Recipe,
  RecommendationItem,
} from '@/app/recipe/[id]/types/recipe.types';
import { Header } from '@/components/common/Header';
import { Toast } from '@/components/common/Toast';
import { ExploreComplete } from '@/components/ExploreComplete';
import { RecipeCard } from '@/components/RecipeCard';
import { useToast } from '@/hooks/useToast';
import { isProduction } from '@/lib/env';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';
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
  const [hasFetched, setHasFetched] = useState(false);
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

  console.info(
    'RecipeRecommend - mood:',
    mood,
    'userSelectedMood:',
    userSelectedMood
  );

  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  // condition 객체를 useMemo로 메모이제이션
  const condition = useMemo(() => {
    const cond = {
      id: moodToConditionId(userSelectedMood),
      name: userSelectedMood,
    };
    console.info('RecipeRecommend - condition 생성:', cond);
    return cond;
  }, [userSelectedMood]);

  const [showTutorial, setShowTutorial] = useState(false);

  // API 응답을 Recipe 타입으로 변환하는 함수
  const mapRecommendationToRecipe = (item: RecommendationItem): Recipe => {
    return {
      description: item.description,
      duration: item.duration,
      id: item.recipeId,
      images: item.imageUrls.map((url, index) => ({
        id: index + 1,
        imageUrl: url,
      })),
      ingredients: {
        alternativeUnavailable: [],
        notOwned: [],
        owned: [],
      },
      isBookmarked: item.isBookmarked,
      seasonings: [],
      steps: [],
      title: item.title,
      tools: item.tools.map((tool, index) => {
        if (typeof tool === 'string') {
          return {
            id: index + 1,
            name: tool,
          };
        }
        return {
          id: tool.id,
          name: tool.name,
          ...(tool.imageUrl && { imageUrl: tool.imageUrl }),
        };
      }),
    };
  };

  // 레시피 추천 API 호출 공통 함수
  const fetchRecommendRecipes = useCallback(async () => {
    try {
      // selectedFoodIds가 비어있으면 API 호출하지 않음
      if (selectedFoodIds?.length === 0) {
        console.warn('선택된 재료가 없어서 레시피 추천을 건너뜁니다.');
        setHasFetched(false);
        return;
      }

      const conditionId = moodToConditionId(userSelectedMood);

      const { data } = await recipe.recipeRecommend(
        conditionId,
        selectedFoodIds
      );

      // API 응답 구조 확인 및 디버깅
      console.info('레시피 추천 API 응답:', data);

      // API 응답에서 items 추출 (data.data.items 또는 data.items 형태 모두 처리)
      let items: RecommendationItem[] | undefined;

      // 1. data.data.items 확인
      const { data: responseData } = data ?? {};
      if (responseData?.items && Array.isArray(responseData.items)) {
        const { items: responseItems } = responseData;
        items = responseItems;
      }
      // 2. data.items 확인
      else if (Array.isArray(data?.items)) {
        const { items: dataItems } = data;
        items = dataItems;
      }
      // 3. data.data가 배열인지 확인
      else if (Array.isArray(responseData)) {
        items = responseData;
      }

      // items가 배열이 아니거나 undefined인 경우
      if (!items || !Array.isArray(items)) {
        console.error(
          '레시피 추천 API 응답: items를 찾을 수 없거나 배열이 아닙니다.',
          {
            'data?.data': responseData,
            'data?.data?.items': responseData?.items,
            'data?.items': data?.items,
            전체응답: data,
          }
        );
        setRecipes([]);
        setHasFetched(true);
        return;
      }

      console.info('추출된 items:', items, 'items 길이:', items.length);

      // API 응답을 Recipe 타입으로 변환
      const mappedRecipes = items.map(mapRecommendationToRecipe);

      console.info(
        '변환된 레시피:',
        mappedRecipes,
        '레시피 개수:',
        mappedRecipes.length
      );

      setRecipes(mappedRecipes);
      setHasFetched(true);

      // 초기 북마크 상태 설정
      const bookmarkedRecipe = mappedRecipes.filter(
        (recipe: Recipe) => recipe.isBookmarked
      );

      const bookmarkedIds = new Set<number>(
        bookmarkedRecipe.map((recipe: Recipe) => recipe.id)
      );

      setLikedRecipes(bookmarkedIds);
    } catch (error) {
      console.error('레시피 추천 조회 실패:', error);

      // 에러 발생 시 상세 정보 로깅
      if (axios.isAxiosError(error)) {
        console.error('에러 응답:', error.response?.data);
        console.error('에러 상태:', error.response?.status);
      }

      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.info('🔒 인증 오류, 로그인 페이지로 이동');
        router.push('/signin');
        return;
      }

      // 에러 발생 시에도 상태를 올바르게 관리 (탐험완료 페이지가 표시되지 않도록)
      // 에러는 실제 빈 배열과 구분하기 위해 hasFetched는 true로 설정하되
      // recipes는 빈 배열로 설정하지 않음 (기존 레시피 유지 또는 로딩 상태 유지)
      // 단, 실제 빈 배열 반환과 구분하기 위해 이전 recipes 상태 유지
      setHasFetched(false);
      showToast('레시피를 불러오는데 실패했어요');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedMood, selectedFoodIds, router]);

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

        // 첫 진입이고, 아직 튜토리얼을 닫은 적이 없고, 레시피가 있을 때만 표시
        // (탐험완료 상태에서는 표시하지 않음)
        if (
          userInfo.isFirstEntry &&
          !tutorialClosed &&
          hasFetched &&
          recipes.length > 0
        ) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        // 인증 오류인 경우 로그인 페이지로 리다이렉트
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.info('🔒 인증 오류, 로그인 페이지로 이동');
          router.push('/signin');
          return;
        }
      }
    };
    fetchProfile();
  }, [router, hasFetched, recipes.length]);

  // 하트 아이콘 클릭 시 북마크 토글 함수
  const handleToggleBookmark = async (_index: number, recipeId: number) => {
    if (isLoading) return;

    setIsLoading(true);
    if (!useCookieAuth && !token) {
      console.error('인증 토큰이 없어 북마크를 변경할 수 없습니다.');
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
      console.error('북마크 토글 실패:', error);
      // 인증 오류인 경우 로그인 페이지로 리다이렉트
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.info('🔒 인증 오류, 로그인 페이지로 이동');
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

  // API 호출 완료 후 레시피가 빈 배열인 경우 탐험완료 컴포넌트 표시
  if (hasFetched && recipes.length === 0) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <RecipeHeader onRefresh={handleRefresh} disabled />
        <Header.Spacer />
        <ExploreComplete />
      </div>
    );
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
            <div className="mt-5 w-full">
              <Toast
                message={message}
                isVisible={isVisible}
                position="card-bottom"
              />
            </div>
            <div className="recipe-pagination mt-4 flex justify-center gap-1.5" />
          </div>
        </div>

        {/* 전역 토스트 */}
      </div>

      {/* 튜토리얼 팝업 */}
      {showTutorial && <TutorialPopup onClose={handleCloseTutorial} />}
    </div>
  );
}
