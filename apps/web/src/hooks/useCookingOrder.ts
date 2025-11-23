import { useEffect, useRef, useState } from 'react';
import { recipe as recipeService } from '@recipot/api';
import { tokenUtils } from 'packages/api/src/auth';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';
import { isProduction } from '@/lib/env';

import { useStartCooking } from './useStartCooking';

interface UseCookingOrderReturn {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  getCompletedRecipeId: () => number | null;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
  getProgressPercentage: () => number;
}

export function useCookingOrder(recipeId: string): UseCookingOrderReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isRecipeLoading, setIsRecipeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const completedRecipeIdRef = useRef<number | null>(null);
  const useCookieAuth = isProduction;

  const startCookingMutation = useStartCooking();
  const { mutateAsync: startCooking } = startCookingMutation;

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = tokenUtils.getToken();
      if (!useCookieAuth && !token) {
        setError('로그인이 필요합니다.');
        setIsRecipeLoading(false);
        return;
      }

      try {
        setIsRecipeLoading(true);
        setError(null);

        // 요리 시작 API 호출
        const completedRecipeId = await startCooking(recipeId);
        if (completedRecipeId) {
          completedRecipeIdRef.current = completedRecipeId;
        }

        // const data = await recipeService.getRecipeDetail(recipeId);
        const data = await recipeService.getPublicRecipeDetail(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error('Recipe fetch error:', err);
        setError('레시피를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsRecipeLoading(false);
      }
    };

    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, useCookieAuth]);

  const completeStep = (stepNumber: number) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  const isStepCompleted = (stepNumber: number): boolean => {
    return completedSteps.has(stepNumber);
  };

  const getProgressPercentage = (): number => {
    if (!recipe?.steps || recipe.steps.length === 0) return 0;
    return Math.round((completedSteps.size / recipe.steps.length) * 100);
  };

  const getCompletedRecipeId = () => completedRecipeIdRef.current;

  // startCooking mutation과 recipe 로딩 상태를 합침
  const isLoading = startCookingMutation.isPending || isRecipeLoading;

  return {
    completeStep,
    error: error ?? startCookingMutation.error?.message ?? null,
    getCompletedRecipeId,
    getProgressPercentage,
    isLoading,
    isStepCompleted,
    recipe,
  };
}
