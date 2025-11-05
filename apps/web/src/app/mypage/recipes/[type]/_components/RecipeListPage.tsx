'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { recipe as recipeApi } from '@recipot/api';
import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import CookedRecipeList from '@/app/mypage/recipes/[type]/_components/CookedRecipeList';
import DefaultRecipeList from '@/app/mypage/recipes/[type]/_components/DefaultRecipeList';
import { useCompletedRecipes } from '@/hooks/useCompletedRecipes';
import { useRecentRecipes } from '@/hooks/useRecentRecipes';
import { useStoredRecipes } from '@/hooks/useStoredRecipes';
import {
  mockCookedRecipes,
  mockDefaultRecipes,
} from '@/mocks/data/myPage.mock';
import type { PageType } from '@/types/MyPage.types';

import type { CompletedRecipe } from '@recipot/api';

const PAGE_CONFIG = {
  cooked: {
    noneBackImage: '/mypage/none-refrigerator-green.png',
    overLayColor: '#F4FCE3',
    themeColor: '#F4FCE3',
    title: '내가 만든 요리',
    titleColor: '#66A80F',
  },
  recent: {
    noneBackImage: '/mypage/none-refrigerator-purple.png',
    overLayColor: '#F3F0FF',
    themeColor: '#f3f0ff',
    title: '최근 본 레시피',
    titleColor: '#845ef7',
  },
  saved: {
    noneBackImage: '/mypage/none-refrigerator-blue.png',
    overLayColor: '#CAE9FF',
    themeColor: '#e7f5ff',
    title: '내가 찜한 레시피',
    titleColor: '#228be6',
  },
};

const hasRecipeDetailData = (detail: unknown): boolean => {
  if (detail === null || detail === undefined) {
    return false;
  }

  if (Array.isArray(detail)) {
    return detail.length > 0;
  }

  if (typeof detail === 'object') {
    return Object.keys(detail as Record<string, unknown>).length > 0;
  }

  if (typeof detail === 'string') {
    return detail.trim().length > 0;
  }

  return true;
};

export default function RecipeListPage({ type }: { type: PageType }) {
  const config = PAGE_CONFIG[type];

  // 완료한 요리 데이터
  const { data: completedRecipesData, isLoading } = useCompletedRecipes({
    limit: 100,
    page: 1,
  });

  const { data: storedRecipesData, isLoading: isStoredLoading } =
    useStoredRecipes({
      limit: 100,
      page: 1,
    });

  const { data: recentRecipesData, isLoading: isRecentLoading } =
    useRecentRecipes({
      limit: 100,
      page: 1,
    });

  // API 데이터 우선 사용, 없으면 mock 데이터
  const cookedRecipes = completedRecipesData?.items ?? mockCookedRecipes;
  const storedRecipes = storedRecipesData?.items ?? mockDefaultRecipes;
  const recentRecipes = recentRecipesData?.items ?? mockDefaultRecipes;
  const defaultRecipe = type === 'saved' ? storedRecipes : recentRecipes;

  const queryClient = useQueryClient();
  const recipeDetailValidityRef = useRef<Map<number, boolean>>(new Map());

  const [filteredCookedRecipes, setFilteredCookedRecipes] =
    useState<CompletedRecipe[]>(cookedRecipes);
  const [filteredDefaultRecipes, setFilteredDefaultRecipes] =
    useState<CompletedRecipe[]>(defaultRecipe);

  const shouldValidateCooked = Boolean(completedRecipesData?.items);
  const shouldValidateDefault =
    type === 'cooked'
      ? false
      : Boolean(
          type === 'saved' ? storedRecipesData?.items : recentRecipesData?.items
        );

  const filterRecipesWithDetail = useCallback(
    async (recipes: CompletedRecipe[]) => {
      if (!recipes.length) {
        return [];
      }

      const results = await Promise.all(
        recipes.map(async recipeItem => {
          if (!recipeItem?.recipeId) {
            return null;
          }

          const cachedValidity = recipeDetailValidityRef.current.get(
            recipeItem.recipeId
          );

          if (cachedValidity !== undefined) {
            return cachedValidity ? recipeItem : null;
          }

          try {
            const detail = await recipeApi.getRecipeDetail(recipeItem.recipeId);
            const isValid = hasRecipeDetailData(detail);
            recipeDetailValidityRef.current.set(recipeItem.recipeId, isValid);
            return isValid ? recipeItem : null;
          } catch {
            recipeDetailValidityRef.current.set(recipeItem.recipeId, false);
            return null;
          }
        })
      );

      return results.filter(
        (recipeItem): recipeItem is CompletedRecipe => recipeItem !== null
      );
    },
    []
  );

  useEffect(() => {
    let isActive = true;

    const validateCookedRecipes = async () => {
      if (!shouldValidateCooked) {
        if (isActive) {
          setFilteredCookedRecipes(cookedRecipes);
        }
        return;
      }

      const validated = await filterRecipesWithDetail(cookedRecipes);
      if (isActive) {
        setFilteredCookedRecipes(validated);
      }
    };

    validateCookedRecipes();

    return () => {
      isActive = false;
    };
  }, [cookedRecipes, filterRecipesWithDetail, shouldValidateCooked]);

  useEffect(() => {
    let isActive = true;

    const validateDefaultRecipes = async () => {
      if (!shouldValidateDefault) {
        if (isActive) {
          setFilteredDefaultRecipes(defaultRecipe);
        }
        return;
      }

      const validated = await filterRecipesWithDetail(defaultRecipe);
      if (isActive) {
        setFilteredDefaultRecipes(validated);
      }
    };

    validateDefaultRecipes();

    return () => {
      isActive = false;
    };
  }, [defaultRecipe, filterRecipesWithDetail, shouldValidateDefault]);

  const handleToggleSave = () => {
    const queryKeys = ['completed-recipes', 'stored-recipes', 'recent-recipes'];
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  };

  // 로딩 처리
  if (isLoading || isStoredLoading || isRecentLoading) {
    return (
      <div>
        <div className="px-5">
          <PageHeader title={config.title} />
        </div>
        <main className="px-5">
          <div className="py-20 text-center text-gray-500">로딩 중...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <div className="px-5">
        <PageHeader title={config.title} />
      </div>
      <main className="px-5">
        {type === 'cooked' ? (
          <CookedRecipeList
            config={config}
            recipes={filteredCookedRecipes}
            onToggleSave={handleToggleSave}
          />
        ) : (
          <DefaultRecipeList
            config={config}
            recipes={filteredDefaultRecipes}
            onToggleSave={handleToggleSave}
            type={type}
          />
        )}
      </main>
    </div>
  );
}
