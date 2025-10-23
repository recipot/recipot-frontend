import { useEffect, useState } from 'react';
import { recipe as recipeAPI } from '@recipot/api';

import type { Recipe } from '@/types/recipe.types';

interface UseCookingOrderReturn {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  completeStep: (stepNumber: number) => void;
  isStepCompleted: (stepNumber: number) => boolean;
  getProgressPercentage: () => number;
  completeCooking: () => Promise<void>;
}

export function useCookingOrder(recipeId: string): UseCookingOrderReturn {
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

        const fetchedRecipe = await recipeAPI.getRecipe(recipeId);
        setRecipe(fetchedRecipe);
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
    if (!recipe?.data.steps || recipe.data.steps.length === 0) return 0;
    return Math.round((completedSteps.size / recipe.data.steps.length) * 100);
  };

  const completeCooking = async () => {
    try {
      await recipeAPI.completeCooking(recipeId);
    } catch (err) {
      console.error('Complete cooking error:', err);
    }
  };

  return {
    completeCooking,
    completeStep,
    error,
    getProgressPercentage,
    isLoading,
    isStepCompleted,
    recipe,
  };
}
