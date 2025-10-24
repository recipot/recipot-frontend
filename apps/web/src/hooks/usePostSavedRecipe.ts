import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storedAPI } from 'packages/api/src/mypageAPI';

import type { CompletedRecipesResponse } from 'packages/api/src/mypageAPI';

export const STORED_RECIPES_QUERY_KEY = ['stored-recipes'] as const;

export const usePostStoredRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: number) => storedAPI.postStoredRecipe(recipeId),

    onError: error => {
      console.error('북마크 등록 실패:', error);
      alert('북마크 등록에 실패했습니다.');
    },

    onSuccess: (_, recipeId) => {
      // 모든 stored-recipes 쿼리의 캐시를 업데이트
      queryClient.setQueriesData<CompletedRecipesResponse['data']>(
        {
          exact: false, // params가 포함된 쿼리도 모두 매칭
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
        refetchType: 'active', // 현재 활성화된 쿼리만 refetch
      });
    },
  });
};
