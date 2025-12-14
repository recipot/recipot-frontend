import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  categoriesAPI,
  type CreateIngredientData,
  type GetIngredientsParams,
  type Ingredient,
  type IngredientCategory,
  ingredientsAPI,
  type UpdateIngredientData,
} from 'packages/api/src/ingredientAPI';

export const INGREDIENTS_QUERY_KEY = ['ingredients'] as const;
export const CATEGORIES_QUERY_KEY = ['ingredient-categories'] as const;

/**
 * 재료 목록 조회 훅
 * @param params - 페이지네이션 파라미터
 * @returns 재료 목록 쿼리 결과
 */
export const useIngredients = (params?: GetIngredientsParams) => {
  return useQuery({
    gcTime: 1000 * 60 * 30, // 30분
    queryFn: () => ingredientsAPI.getIngredients(params),
    queryKey: [...INGREDIENTS_QUERY_KEY, params],
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 카테고리 목록 조회 훅
 * @returns 카테고리 목록 쿼리 결과
 */
export const useCategories = () => {
  return useQuery({
    gcTime: 1000 * 60 * 60, // 1시간
    queryFn: categoriesAPI.getCategories,
    queryKey: CATEGORIES_QUERY_KEY,
    staleTime: 1000 * 60 * 10, // 10분 (카테고리는 자주 변경되지 않음)
  });
};

/**
 * 재료 생성 mutation 훅
 * @returns 재료 생성 mutation
 */
export const useCreateIngredients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: CreateIngredientData[]) =>
      ingredientsAPI.createIngredients(items),
    onSuccess: () => {
      // 재료 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
    },
  });
};

/**
 * 재료 수정 mutation 훅
 * @returns 재료 수정 mutation
 */
export const useUpdateIngredients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: UpdateIngredientData[]) =>
      ingredientsAPI.updateIngredients(items),
    onSuccess: () => {
      // 재료 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
    },
  });
};

/**
 * 재료 삭제 mutation 훅
 * @returns 재료 삭제 mutation
 */
export const useDeleteIngredients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => ingredientsAPI.deleteIngredients(ids),
    onSuccess: () => {
      // 재료 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
    },
  });
};

/**
 * 단일 재료 삭제 mutation 훅
 * @returns 단일 재료 삭제 mutation
 */
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ingredientsAPI.deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INGREDIENTS_QUERY_KEY });
    },
  });
};

/**
 * 카테고리 생성 mutation 훅
 * @returns 카테고리 생성 mutation
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => categoriesAPI.createCategory(name),
    onSuccess: () => {
      // 카테고리 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

/**
 * 카테고리 삭제 mutation 훅
 * @returns 카테고리 삭제 mutation
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

/**
 * 재료 캐시 데이터 조회 훅 (API 호출 없음)
 * @param params - 페이지네이션 파라미터
 * @returns 캐시된 재료 데이터
 */
export const useIngredientsCache = (params?: GetIngredientsParams) => {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData<Ingredient[]>([
    ...INGREDIENTS_QUERY_KEY,
    params,
  ]);

  return {
    hasCache: !!cachedData,
    ingredients: cachedData ?? [],
  };
};

/**
 * 카테고리 캐시 데이터 조회 훅 (API 호출 없음)
 * @returns 캐시된 카테고리 데이터
 */
export const useCategoriesCache = () => {
  const queryClient = useQueryClient();

  const cachedData =
    queryClient.getQueryData<IngredientCategory[]>(CATEGORIES_QUERY_KEY);

  return {
    categories: cachedData ?? [],
    hasCache: !!cachedData,
  };
};
