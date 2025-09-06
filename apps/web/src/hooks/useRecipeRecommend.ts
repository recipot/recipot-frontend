import { useCallback, useEffect, useState } from 'react';

import type { Recipe, RecipeRecommendResponse } from '@/types/recipe.types';

interface UseRecipeRecommendReturn {
  recipes: Recipe[];
  selectedIngredients: string[];
  snackbarMessage: string;
  loading: boolean;
  error: string | null;
  likedRecipes: boolean[];
  fetchRecipeRecommend: () => Promise<void>;
  toggleLike: (index: number) => Promise<void>;
}

export const useRecipeRecommend = (): UseRecipeRecommendReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedRecipes, setLikedRecipes] = useState<boolean[]>([]);

  const fetchRecipeRecommend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/recipe-recommend');

      if (!response.ok) {
        throw new Error('레시피 추천을 불러오는데 실패했습니다.');
      }

      const data: RecipeRecommendResponse = await response.json();

      setRecipes(data.recipes);
      setSelectedIngredients(data.selectedIngredients);
      setSnackbarMessage(data.message);
      setLikedRecipes(new Array(data.recipes.length).fill(false));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(
    async (index: number) => {
      if (index < 0 || index >= recipes.length) return;

      const recipe = recipes[index];
      const isCurrentlyLiked = likedRecipes[index];

      try {
        const response = await fetch(
          `/api/recipe-recommend/${recipe.id}/like`,
          {
            method: isCurrentlyLiked ? 'DELETE' : 'POST',
          }
        );

        if (response.ok) {
          setLikedRecipes(prev => {
            const newLikes = [...prev];
            newLikes[index] = !newLikes[index];
            return newLikes;
          });
        }
      } catch (err) {
        console.error('좋아요 토글 실패:', err);
      }
    },
    [recipes, likedRecipes]
  );

  useEffect(() => {
    fetchRecipeRecommend();
  }, [fetchRecipeRecommend]);

  return {
    error,
    fetchRecipeRecommend,
    likedRecipes,
    loading,
    recipes,
    selectedIngredients,
    snackbarMessage,
    toggleLike,
  };
};
