import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { RecipeRecommendResponse } from '@/types/recipe.types';

// TODO : 추후 타입 정의 변경 필요
interface RecipeRecommendReturn {
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

  const handleUpdateSelectedIngredients = useCallback(
    async (ingredients: string[]) => {
      await updateIngredientsMutation.mutateAsync(ingredients);
    },
    [updateIngredientsMutation]
  );

  return {
    selectedIngredients: selectedIngredientsData?.selectedIngredients ?? [],
    updateSelectedIngredients: handleUpdateSelectedIngredients,
  };
};
