import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { Recipe, RecipeRecommendResponse } from '@/types/recipe.types';

interface UseRecipeRecommendReturn {
  recipes: Recipe[];
  selectedIngredients: string[];
  snackbarMessage: string;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  likedRecipes: boolean[];
  refetch: () => void;
  toggleLike: (index: number) => Promise<void>;
}

// API 함수들
const fetchRecipeRecommend = async (): Promise<RecipeRecommendResponse> => {
  const response = await fetch('/api/recipe-recommend');
  if (!response.ok) {
    throw new Error('레시피 추천을 불러오는데 실패했습니다.');
  }
  return response.json();
};

const toggleRecipeLike = async (
  recipeId: number,
  isLiked: boolean
): Promise<void> => {
  const response = await fetch(`/api/recipe-recommend/${recipeId}/like`, {
    method: isLiked ? 'DELETE' : 'POST',
  });
  if (!response.ok) {
    throw new Error('좋아요 상태 변경에 실패했습니다.');
  }
};

export const useRecipeRecommend = (): UseRecipeRecommendReturn => {
  const [likedRecipes, setLikedRecipes] = useState<boolean[]>([]);

  // 레시피 추천 데이터 조회
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 좋아요 토글 뮤테이션
  const likeMutation = useMutation({
    mutationFn: ({
      isLiked,
      recipeId,
    }: {
      recipeId: number;
      isLiked: boolean;
    }) => toggleRecipeLike(recipeId, isLiked),
    onSuccess: (_, { isLiked, recipeId }) => {
      setLikedRecipes(prev => {
        const recipeIndex = data?.recipes.findIndex(
          recipe => recipe.id === recipeId
        );
        if (recipeIndex !== undefined && recipeIndex >= 0) {
          const newLikes = [...prev];
          newLikes[recipeIndex] = !isLiked;
          return newLikes;
        }
        return prev;
      });
    },
  });

  // 데이터 로드 시 좋아요 상태 초기화
  if (data?.recipes && likedRecipes.length === 0) {
    setLikedRecipes(new Array(data.recipes.length).fill(false));
  }

  const toggleLike = useCallback(
    async (index: number) => {
      if (!data?.recipes || index < 0 || index >= data.recipes.length) return;

      const recipe = data.recipes[index];
      const isCurrentlyLiked = likedRecipes[index] ?? false;

      likeMutation.mutate({
        isLiked: isCurrentlyLiked,
        recipeId: recipe.id,
      });
    },
    [data?.recipes, likedRecipes, likeMutation]
  );

  return {
    error,
    isError,
    isLoading,
    likedRecipes,
    recipes: data?.recipes ?? [],
    refetch,
    selectedIngredients: data?.selectedIngredients ?? [],
    snackbarMessage: data?.message ?? '',
    toggleLike,
  };
};
