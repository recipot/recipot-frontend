import { recipe as recipeService } from '@recipot/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

import { COMPLETED_RECIPES_QUERY_KEY } from './useCompletedRecipes';

/**
 * 레시피 요리 완료 API 호출 훅
 * @returns React Query mutation 객체
 */
export const useCompleteCooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (completedRecipeId: number) => {
      await recipeService.completeCooking(completedRecipeId);
      return completedRecipeId;
    },
    onError: error => {
      console.error('요리 완료 실패:', error);

      useApiErrorModalStore.getState().showError({
        message: '요리 완료 처리에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
    },
    onSuccess: () => {
      // 완료한 레시피 캐시 무효화 - 메인 페이지에서 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: COMPLETED_RECIPES_QUERY_KEY,
      });
    },
  });
};
