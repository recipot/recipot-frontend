import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { RecipeRecommendResponse } from '@/types/recipe.types';

// TODO : 추후 타입 정의 변경 필요
interface RecipeRecommendReturn {
  likedRecipes: boolean[];
  toggleLike: (index: number, recipeId: number) => Promise<void>;
  selectedIngredients: string[];
  updateSelectedIngredients: (ingredients: string[]) => Promise<void>;
}

// API 함수들
export const fetchRecipeRecommend =
  async (): Promise<RecipeRecommendResponse> => {
    // TODO : API 나오면 수정 필요
    const response = await fetch('/api/recipe-recommend');
    if (!response.ok) {
      throw new Error('레시피 추천을 불러오는데 실패했습니다.');
    }
    return response.json();
  };

const toggleRecipeLike = async (recipeId: number, isLiked: boolean) => {
  // TODO : API 나오면 수정 필요
  const response = await fetch(`/api/recipe-recommend/${recipeId}/like`, {
    method: isLiked ? 'DELETE' : 'POST',
  });
  if (!response.ok) {
    throw new Error('좋아요 상태 변경에 실패했습니다.');
  }
};

// 선택된 재료 관련 API 함수들
const fetchSelectedIngredients = async (): Promise<{
  selectedIngredients: string[];
}> => {
  // TODO : API 나오면 수정 필요
  const response = await fetch('/api/selected-ingredients');
  if (!response.ok) {
    throw new Error('선택된 재료 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
};

const updateSelectedIngredients = async (selectedIngredients: string[]) => {
  // TODO : API 나오면 수정 필요
  const response = await fetch('/api/selected-ingredients', {
    body: JSON.stringify({ selectedIngredients }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('선택된 재료 목록 업데이트에 실패했습니다.');
  }
};

export const useRecipeRecommend = (): RecipeRecommendReturn => {
  const [likedRecipes, setLikedRecipes] = useState<boolean[]>([]);

  // 선택된 재료 목록 조회
  const { data: selectedIngredientsData, refetch: refetchSelectedIngredients } =
    useQuery({
      queryFn: fetchSelectedIngredients,
      queryKey: ['selectedIngredients'],
      staleTime: 5 * 60 * 1000, // 5분
    });

  // 선택된 재료 업데이트 뮤테이션
  const updateIngredientsMutation = useMutation({
    mutationFn: updateSelectedIngredients,
    onSuccess: () => {
      refetchSelectedIngredients();
    },
  });

  // 좋아요 토글 뮤테이션
  // TODO : API 나오면 수정 필요
  const likeMutation = useMutation({
    mutationFn: ({
      isLiked,
      recipeId,
    }: {
      recipeId: number;
      isLiked: boolean;
      index: number;
    }) => toggleRecipeLike(recipeId, isLiked),
    onSuccess: (_, { index, isLiked }) => {
      setLikedRecipes(prev => {
        // 배열이 비어있으면 새로 생성
        if (prev.length === 0) {
          const newLikes = new Array(index + 1).fill(false);
          newLikes[index] = !isLiked;
          return newLikes;
        }

        // 배열이 있으면 업데이트
        const newLikes = [...prev];
        if (index >= 0 && index < newLikes.length) {
          newLikes[index] = !isLiked;
        }
        return newLikes;
      });
    },
  });

  const toggleLike = useCallback(
    async (index: number, recipeId: number) => {
      if (index < 0) return;

      // 배열이 비어있으면 false로 처리
      const isCurrentlyLiked = likedRecipes[index] ?? false;

      likeMutation.mutate({
        index,
        isLiked: isCurrentlyLiked,
        recipeId,
      });
    },
    [likedRecipes, likeMutation]
  );

  const handleUpdateSelectedIngredients = useCallback(
    async (ingredients: string[]) => {
      await updateIngredientsMutation.mutateAsync(ingredients);
    },
    [updateIngredientsMutation]
  );

  return {
    likedRecipes,
    selectedIngredients: selectedIngredientsData?.selectedIngredients ?? [],
    toggleLike,
    updateSelectedIngredients: handleUpdateSelectedIngredients,
  };
};
