import { useEffect, useRef, useState } from 'react';
import { recipe } from '@recipot/api';
import axios from 'axios';

import type { AdminRecipe, AdminRecipesResponse } from '@recipot/api';

interface UseAdminRecipesReturn {
  recipes: AdminRecipe[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * 어드민 레시피 조회 훅
 * 전체 레시피 데이터를 조회하는 역할만 담당
 * 페이지네이션은 usePaginatedList 훅을 사용
 */
export function useAdminRecipes(): UseAdminRecipesReturn {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (isLoadingRef.current) return;

      setIsLoading(true);
      setError(null);
      isLoadingRef.current = true;

      try {
        const response: AdminRecipesResponse['data'] =
          await recipe.getAllAdminRecipes();

        const fetchedRecipes = response?.items ?? [];
        setRecipes(fetchedRecipes);
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
        isLoadingRef.current = false;
      }
    };

    fetchRecipes();
  }, []);

  return {
    error,
    isLoading,
    recipes,
  };
}
