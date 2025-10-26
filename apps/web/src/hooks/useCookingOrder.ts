import { useEffect, useState } from 'react';
import axios from 'axios';
import { tokenUtils } from 'packages/api/src/auth';

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

  const token = tokenUtils.getToken();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 요리 시작 API 호출
        // await recipeAPI.startCooking(recipeId);
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/${recipeId}/start`,
          {
            recipeId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // const fetchedRecipe = await recipeAPI.getRecipe(recipeId);
        const {
          data: { data },
        } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecipe(data);

        // setRecipe(fetchedRecipe);
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
