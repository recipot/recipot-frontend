import { useEffect, useState } from 'react';
import { recipe as recipeService } from '@recipot/api';
import { tokenUtils } from 'packages/api/src/auth';

import { isProduction } from '@/lib/env';
import type { Recipe } from '@/types/recipe.types';

interface UseCookingOrderReturn {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
  getProgressPercentage: () => number;
}

export function useCookingOrder(recipeId: string): UseCookingOrderReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const useCookieAuth = isProduction;

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = tokenUtils.getToken();
      if (!useCookieAuth && !token) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 요리 시작 API 호출
        await recipeService.startCooking(recipeId);

        const data = await recipeService.getRecipeDetail(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error('Recipe fetch error:', err);
        setError('레시피를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
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

  return {
    completeStep,
    error,
    getProgressPercentage,
    isLoading,
    isStepCompleted,
    recipe,
  };
}
