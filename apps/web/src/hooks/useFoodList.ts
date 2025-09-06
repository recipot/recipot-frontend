import { useQuery } from '@tanstack/react-query';

import { foodAPI } from '@/api/foodAPI';

export const FOOD_LIST_QUERY_KEY = ['food-list'] as const;

export const useFoodList = () => {
  return useQuery({
    gcTime: 1000 * 60 * 60, // 1시간간 캐시 유지
    queryFn: foodAPI.getFoodList,
    queryKey: FOOD_LIST_QUERY_KEY,
    staleTime: 1000 * 60 * 30, // 30분간 fresh 상태 유지
  });
};
