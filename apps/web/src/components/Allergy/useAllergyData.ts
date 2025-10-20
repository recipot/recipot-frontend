'use client';

import { useMemo } from 'react';
import { fetchRestrictedIngredients } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';

import type { AllergyCategory } from '@/types/allergy.types';
import {
  extractInitialSelectedIds,
  mapIngredientsToCategories,
} from '@/utils/allergyMapper';

import { CATEGORY_METADATA } from './Allergy.constants';

/**
 * 알레르기 재료 데이터를 페칭하고 UI 형태로 변환하는 훅
 * @returns categories - UI에 표시할 카테고리 배열
 * @returns initialSelectedIds - 초기 선택된 재료 ID 배열
 * @returns isLoading - 로딩 상태
 * @returns error - 에러 상태
 * @returns refetch - 데이터 재조회 함수
 */
export const useAllergyData = () => {
  const { data, error, isLoading, refetch } = useQuery({
    gcTime: 10 * 60 * 1000, // 10분간 가비지 컬렉션 방지
    queryFn: fetchRestrictedIngredients,
    queryKey: ['restrictedIngredients'],
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 백엔드 데이터를 UI 카테고리 형태로 변환
  const categories: AllergyCategory[] = useMemo(() => {
    if (!data) return [];
    return mapIngredientsToCategories(data, CATEGORY_METADATA);
  }, [data]);

  // 초기 선택된 항목 (isUserRestricted: true인 항목)
  const initialSelectedIds = useMemo(() => {
    if (!data) return [];
    return extractInitialSelectedIds(data);
  }, [data]);

  return {
    categories,
    error,
    initialSelectedIds,
    isLoading,
    refetch,
  };
};

export default useAllergyData;
