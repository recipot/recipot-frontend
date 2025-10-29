import { useEffect, useState } from 'react';
import { recipe as recipeAPI } from 'packages/api/src/recipe';

import type { Recipe } from 'packages/api/src/types';

interface UseCookingOrderReturn {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
  getProgressPercentage: () => number;
}

export function useCookingOrder(recipeId: number): UseCookingOrderReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 요리 시작 API 호출
        await recipeAPI.startCooking(recipeId);

        // 레시피 상세 조회
        const data = await recipeAPI.getRecipeDetail(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error('Recipe fetch error:', err);
        setError('레시피를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

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
