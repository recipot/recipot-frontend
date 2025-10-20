import { useEffect, useState } from 'react';

import { recipeAPI } from '@/api/recipeAPI';
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fetchedRecipe = await recipeAPI.getRecipe(recipeId);
        setRecipe(fetchedRecipe);
      } catch (err) {
        setError('레시피를 불러오는 중 오류가 발생했습니다.');
        console.error('Recipe fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  console.log(recipe, 'recipe order');

  const completeStep = (stepNumber: number) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  const isStepCompleted = (stepNumber: number): boolean => {
    return completedSteps.has(stepNumber);
  };

  const getProgressPercentage = (): number => {
    if (!recipe) return 0;
    return Math.round((completedSteps.size / recipe.cookingSteps.length) * 100);
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
