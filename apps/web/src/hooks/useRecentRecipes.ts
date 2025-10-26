import { useQuery } from '@tanstack/react-query';
import { recentAPI } from 'packages/api/src/mypageAPI';

import type { GetCompletedRecipesParams } from 'packages/api/src/mypageAPI';

export const RECENT_RECIPES_QUERY_KEY = ['recent-recipes'] as const;

export const useRecentRecipes = (params?: GetCompletedRecipesParams) => {
  return useQuery({
    // gcTime: 1000 * 60 * 30, // TODO: 캐시 판단
    queryFn: () => recentAPI.getRecentRecipes(params),
    queryKey: [...RECENT_RECIPES_QUERY_KEY, params],
    staleTime: 0,
    // staleTime: 1000 * 60 * 5,
  });
};
