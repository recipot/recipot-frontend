import { useQueryClient } from '@tanstack/react-query';

import { COMPLETED_RECIPES_QUERY_KEY } from './useCompletedRecipes';

import type { CompletedRecipesResponse } from 'packages/api/src/mypageAPI';

/**
 * 완료한 레시피 데이터를 캐시에서만 가져오는 훅
 * API 호출을 하지 않고 기존 캐시된 데이터만 반환합니다.
 *
 * @returns 완료한 레시피 총 개수 (캐시에 없으면 0)
 */
export const useCompletedRecipesCache = () => {
  const queryClient = useQueryClient();

  // 캐시된 데이터 가져오기 (API 호출 없음)
  const cachedData = queryClient.getQueryData<CompletedRecipesResponse['data']>(
    [...COMPLETED_RECIPES_QUERY_KEY, { limit: 10, page: 1 }]
  );

  return {
    completedRecipesCount: cachedData?.total ?? 0,
    hasCache: !!cachedData,
  };
};
