import { recentAPI } from '@recipot/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

export const RECENT_RECIPES_QUERY_KEY = ['recent-recipes'] as const;

export const usePostRecentRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => recentAPI.postRecentRecipe(recipeId),
    onError: error => {
      console.error('최근 본 레시피 등록 실패:', error);

      useApiErrorModalStore.getState().showError({
        message:
          '최근 본 레시피 등록에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: RECENT_RECIPES_QUERY_KEY,
      });
    },
  });
};
