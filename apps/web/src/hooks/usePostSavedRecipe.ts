import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storedAPI } from '@recipot/api';

import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

export const STORED_RECIPES_QUERY_KEY = ['stored-recipes'] as const;

export const usePostStoredRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => storedAPI.postStoredRecipe(recipeId),
    onError: error => {
      console.error('북마크 등록 실패:', error);

      useApiErrorModalStore.getState().showError({
        message: '북마크 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORED_RECIPES_QUERY_KEY,
      });
    },
  });
};
