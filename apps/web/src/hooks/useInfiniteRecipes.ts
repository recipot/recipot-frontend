import { useCallback, useEffect, useRef, useState } from 'react';
import { recipe } from '@recipot/api';
import axios from 'axios';

import type { AdminRecipe, AdminRecipesResponse } from '@recipot/api';

interface UseInfiniteRecipesReturn {
  recipes: AdminRecipe[];
  isLoading: boolean;
  hasNextPage: boolean;
  error: Error | null;
  loadMore: () => void;
}

const PAGE_SIZE = 20;

/**
 * 무한스크롤을 위한 레시피 조회 훅
 */
export function useInfiniteRecipes(): UseInfiniteRecipesReturn {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef(false);

  const fetchRecipes = useCallback(async (page: number) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = (await recipe.getAllAdminRecipes(
        page,
        PAGE_SIZE
      )) as AdminRecipesResponse;

      const newRecipes = response?.data?.items ?? [];
      const hasNext = response?.data?.hasNextPage ?? false;

      if (page === 1) {
        setRecipes(newRecipes);
      } else {
        setRecipes(prev => [...prev, ...newRecipes]);
      }

      setCurrentPage(page);
      setHasNextPage(hasNext);
    } catch (err) {
      console.error('레시피 조회 실패:', err);

      if (axios.isAxiosError(err)) {
        console.error('에러 응답:', err.response?.data);
        console.error('에러 상태:', err.response?.status);

        if (err.response?.status === 401) {
          console.info('🔒 인증 오류 감지');
        }
      }

      setError(err instanceof Error ? err : new Error('레시피 조회 실패'));
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage && !isFetchingRef.current) {
      fetchRecipes(currentPage + 1);
    }
  }, [currentPage, hasNextPage, isLoading, fetchRecipes]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchRecipes(1);
  }, [fetchRecipes]);

  return {
    error,
    hasNextPage,
    isLoading,
    loadMore,
    recipes,
  };
}
