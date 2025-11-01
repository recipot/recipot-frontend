import { recipe as recipeService } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

/**
 * 레시피 요리 시작 API 호출 훅
 * @returns React Query mutation 객체 (completedRecipeId를 반환)
 */
export const useStartCooking = () => {
  return useMutation({
    mutationFn: async (recipeId: string | number) => {
      return await recipeService.startCooking(recipeId);
    },
    onError: error => {
      console.error('요리 시작 실패:', error);

      useApiErrorModalStore.getState().showError({
        message: '요리 시작에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
    },
  });
};
