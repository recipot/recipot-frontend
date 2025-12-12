import { condition } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';

export const CONDITIONS_QUERY_KEY = ['conditions'] as const;

export const useConditions = () => {
  return useQuery({
    gcTime: 1000 * 60 * 60, // 1시간간 캐시 유지
    queryFn: condition.getConditions,
    queryKey: CONDITIONS_QUERY_KEY,
    staleTime: 0, // 30분간 fresh 상태 유지
  });
};
