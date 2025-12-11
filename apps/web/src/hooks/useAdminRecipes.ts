import { recipe } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { AdminRecipe, AdminRecipesResponse } from '@recipot/api';

export const ADMIN_RECIPES_QUERY_KEY = ['admin-recipes'] as const;

/**
 * 어드민 레시피 조회 훅
 * 전체 레시피 데이터를 조회하는 역할만 담당
 * 페이지네이션은 usePaginatedList 훅을 사용
 */
export function useAdminRecipes() {
  const { data, error, isLoading, refetch } = useQuery<
    AdminRecipesResponse['data'],
    Error
  >({
    queryFn: async () => {
      try {
        return await recipe.getAllAdminRecipes();
      } catch (err) {
        console.error('레시피 조회 실패:', err);

        if (axios.isAxiosError(err)) {
          console.error('에러 응답:', err.response?.data);
          console.error('에러 상태:', err.response?.status);

          if (err.response?.status === 401) {
            console.info('🔒 인증 오류 감지');
          }
        }

        throw err instanceof Error ? err : new Error('레시피 조회 실패');
      }
    },
    queryKey: ADMIN_RECIPES_QUERY_KEY,
    staleTime: 0, // 항상 최신 데이터를 가져오도록 설정
  });

  const recipes: AdminRecipe[] = data?.items ?? [];

  return {
    error: error ?? null,
    isLoading,
    recipes,
    refetch,
  };
}
