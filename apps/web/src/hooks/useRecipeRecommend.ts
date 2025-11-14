import { useCallback, useEffect, useRef, useState } from 'react';
import { recipe, storedAPI } from '@recipot/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { moodToConditionId } from '@/app/onboarding/_utils/conditionMapper';
import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import type { MoodType } from '@/components/EmotionState';
import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';
import { handleAuthError } from '@/utils/errorHandler';
import { mapRecommendationToRecipe } from '@/utils/recipeMapper';

interface UseRecipeRecommendParams {
  enabled?: boolean;
  selectedFoodIds: number[];
  showToast: (message: string) => void;
  userSelectedMood: MoodType;
}

/**
 * 레시피 추천 API 호출 및 상태 관리 훅
 */
export const useRecipeRecommend = ({
  enabled = true,
  selectedFoodIds,
  showToast,
  userSelectedMood,
}: UseRecipeRecommendParams) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const lastFetchKeyRef = useRef<string | null>(null);
  const router = useRouter();

  // API 호출 함수
  const callRecipeRecommendAPI = async (page: number) => {
    const conditionId = moodToConditionId(userSelectedMood);
    return recipe.recipeRecommend(conditionId, selectedFoodIds, page);
  };

  // 응답 데이터 검증 및 변환
  const processRecipeResponse = (
    response: Awaited<ReturnType<typeof recipe.recipeRecommend>>,
    page: number
  ) => {
    const items = response?.data?.items ?? [];
    const responseCurrentPage = response?.data?.currentPage ?? page;

    if (!Array.isArray(items) || items.length === 0) {
      console.error('⚠️ 레시피 추천 결과가 빈 배열입니다. API 응답:', response);
      return { currentPage: responseCurrentPage, recipes: [] };
    }

    const mappedRecipes = items.map(mapRecommendationToRecipe);

    if (mappedRecipes.length === 0) {
      console.info('변환된 레시피가 빈 배열입니다.');
      return { currentPage: responseCurrentPage, recipes: [] };
    }

    return {
      currentPage: responseCurrentPage,
      recipes: mappedRecipes,
    };
  };

  // 상태 업데이트
  const updateRecipeState = (
    recipes: Recipe[],
    page: number,
    fetched: boolean
  ) => {
    setRecipes(recipes);
    setCurrentPage(page);
    setHasFetched(fetched);
  };

  // 에러 처리
  const handleFetchError = (error: unknown) => {
    console.error('레시피 추천 조회 실패:', error);

    if (axios.isAxiosError(error)) {
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);

      // 401 인증 오류는 API 인터셉터에서 처리하므로 여기서는 로깅만
      if (error.response?.status === 401) {
        console.info('🔒 인증 오류 감지 (인터셉터에서 처리됨)');
      }
    }

    setHasFetched(false);
    showToast('레시피를 불러오는데 실패했어요');
    return false;
  };

  // 레시피 조회 메인 로직
  const fetchRecipes = async (page: number = 1) => {
    if (selectedFoodIds?.length === 0) {
      console.warn('선택된 재료가 없어서 레시피 추천을 건너뜁니다.');
      setHasFetched(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await callRecipeRecommendAPI(page);
      const { currentPage: responsePage, recipes: processedRecipes } =
        processRecipeResponse(response, page);

      updateRecipeState(processedRecipes, responsePage, true);
    } catch (error) {
      const isAuthError = handleFetchError(error);
      if (isAuthError) {
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 다음 페이지 레시피 조회
  const refreshRecipes = async () => {
    const nextPage = currentPage + 1;
    await fetchRecipes(nextPage);
  };

  // 북마크 토글
  const toggleBookmark = useCallback(
    async (recipeId: number): Promise<void> => {
      if (isBookmarkLoading) {
        return;
      }

      const token = tokenUtils.getToken();
      const useCookieAuth = isProduction;
      if (!useCookieAuth && !token) {
        console.warn(
          '[useRecipeRecommend] 인증 토큰 없음, 로그인 페이지로 이동'
        );
        router.push('/signin');
        return;
      }

      const currentRecipe = recipes.find(recipe => recipe.id === recipeId);
      if (!currentRecipe) {
        console.warn('[useRecipeRecommend] 레시피를 찾을 수 없음', {
          recipeId,
        });
        return;
      }

      const isCurrentlyBookmarked = currentRecipe.isBookmarked;

      setIsBookmarkLoading(true);

      // 낙관적 업데이트
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, isBookmarked: !isCurrentlyBookmarked }
            : recipe
        )
      );

      try {
        if (isCurrentlyBookmarked) {
          await storedAPI.deleteStoredRecipe(recipeId);
        } else {
          await storedAPI.postStoredRecipe(recipeId);
          showToast('레시피가 저장되었어요!');
        }
      } catch (error) {
        // 상태 동기화 또는 롤백
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === recipeId
              ? {
                  ...recipe,
                  isBookmarked: !isCurrentlyBookmarked,
                }
              : recipe
          )
        );

        if (handleAuthError(error, router)) {
          return;
        }
        useApiErrorModalStore.getState().showError({
          message: '북마크 처리 중 오류가 발생했어요.',
        });
      } finally {
        setIsBookmarkLoading(false);
      }
    },
    [isBookmarkLoading, recipes, router, showToast]
  );

  // 조건 변경 시 자동으로 레시피 조회
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
    setCurrentPage(1); // 새로운 조건으로 검색 시 페이지 초기화
    fetchRecipes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFoodIds, userSelectedMood, enabled]);

  // 북마크 상태 업데이트 함수
  const updateRecipeBookmark = useCallback(
    (recipeId: number, isBookmarked: boolean) => {
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe.id === recipeId ? { ...recipe, isBookmarked } : recipe
        )
      );
    },
    []
  );

  return {
    currentPage,
    fetchRecipes,
    hasFetched,
    isLoading,
    recipes,
    refreshRecipes,
    toggleBookmark,
    updateRecipeBookmark,
  };
};
