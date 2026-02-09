import { type CompletedRecipesResponse,storedAPI } from '@recipot/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';

export const STORED_RECIPES_QUERY_KEY = ['stored-recipes'] as const;

export const useDeleteStoredRecipe = () => {
  const queryClient = useQueryClient();

  const updateStoredRecipesCache = (recipeId: number) => {
    queryClient.setQueriesData<CompletedRecipesResponse['data']>(
      {
        exact: false,
        queryKey: STORED_RECIPES_QUERY_KEY,
      },
      oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: oldData.items.filter(recipe => recipe.recipeId !== recipeId),
          total: oldData.total - 1,
        };
      }
    );

    queryClient.invalidateQueries({
      queryKey: STORED_RECIPES_QUERY_KEY,
      refetchType: 'active',
    });
  };

  return useMutation({
    mutationFn: (recipeId: number) => storedAPI.deleteStoredRecipe(recipeId),

    onError: error => {
      console.error('북마크 해제 실패:', error);
      useApiErrorModalStore.getState().showError({
        message: '북마크 해제에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
    },

    onSuccess: (_, recipeId) => {
      if (recipeId == null) return;
      updateStoredRecipesCache(recipeId);
    },
  });
};
