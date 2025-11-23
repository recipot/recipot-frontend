import { useQuery } from '@tanstack/react-query';
import { storedAPI } from '@recipot/api';

import type { GetCompletedRecipesParams } from '@recipot/api';

export const STORED_RECIPES_QUERY_KEY = ['stored-recipes'] as const;

export const useStoredRecipes = (params?: GetCompletedRecipesParams) => {
  return useQuery({
    // gcTime: 1000 * 60 * 30, // TODO: 캐시 판단
    queryFn: () => storedAPI.getStoredRecipes(params),
    queryKey: [...STORED_RECIPES_QUERY_KEY, params],
    staleTime: 0,
    // staleTime: 1000 * 60 * 5,
  });
};
