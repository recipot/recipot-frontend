import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storedAPI } from 'packages/api/src/mypageAPI';

export const STORED_RECIPES_QUERY_KEY = ['stored-recipes'] as const;

export const usePostStoredRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => storedAPI.postStoredRecipe(recipeId),

    onError: error => {
      console.error('북마크 등록 실패:', error);
      alert('북마크 등록에 실패했습니다.');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORED_RECIPES_QUERY_KEY,
      });
    },
  });
};
