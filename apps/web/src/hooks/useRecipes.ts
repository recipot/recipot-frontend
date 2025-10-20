import { useEffect, useState } from 'react';

import { recipeAPI } from '@/api/recipeAPI';
import type { Recipe } from '@/types/recipe.types';

interface UseRecipesReturn {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedRecipes = await recipeAPI.getRecipes();
      setRecipes(fetchedRecipes);
    } catch (err) {
      setError('레시피 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('Recipes fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    error,
    isLoading,
    recipes,
    refetch: fetchRecipes,
  };
}
