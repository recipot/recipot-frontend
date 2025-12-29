import { recipesAPI } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useQuery } from '@tanstack/react-query';

import type { GetCompletedRecipesParams } from '@recipot/api';

export const COMPLETED_RECIPES_QUERY_KEY = ['completed-recipes'] as const;

export const useCompletedRecipes = (params?: GetCompletedRecipesParams) => {
  const { user } = useAuth();

  return useQuery({
    enabled: !!user, // 로그인한 사용자만 조회
    gcTime: 1000 * 60 * 30, // TODO: 캐시 판단
    queryFn: () => recipesAPI.getCompletedRecipes(params),
    queryKey: [...COMPLETED_RECIPES_QUERY_KEY, params],
    // staleTime: 0,
    staleTime: 1000 * 60 * 5,
  });
};
