import { useState } from 'react';
import { storedAPI } from '@recipot/api';
import { useRouter } from 'next/navigation';
import { tokenUtils } from '@recipot/api';

import { isProduction } from '@/lib/env';
import { handleAuthError } from '@/utils/errorHandler';

interface UseBookmarkParams {
  showToast: (message: string) => void;
  initialBookmarkedIds?: Set<number> | number[];
  onBookmarkChange?: (recipeId: number, isBookmarked: boolean) => void;
}

interface UseBookmarkReturn {
  bookmarkedRecipes: number[];
  toggleBookmark: (recipeId: number) => Promise<void>;
  isLoading: boolean;
  setBookmarkedRecipes: (ids: number[]) => void;
}

/**
 * 북마크 토글 및 상태 관리 훅
 */
export const useBookmark = ({
  initialBookmarkedIds,
  onBookmarkChange,
  showToast,
}: UseBookmarkParams): UseBookmarkReturn => {
  const getInitialBookmarkedRecipes = () => {
    if (!initialBookmarkedIds) return [];
    return Array.isArray(initialBookmarkedIds)
      ? initialBookmarkedIds
      : Array.from(initialBookmarkedIds);
  };

  const router = useRouter();
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<number[]>(
    getInitialBookmarkedRecipes
  );
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthentication = (): boolean => {
    const token = tokenUtils.getToken();
    const useCookieAuth = isProduction;

    if (!useCookieAuth && !token) {
      console.error('인증 토큰이 없어 북마크를 변경할 수 없습니다.');
      router.push('/signin');
      return false;
    }
    return true;
  };

  const addBookmark = async (recipeId: number): Promise<void> => {
    await storedAPI.postStoredRecipe(recipeId);
    setBookmarkedRecipes(prev => [...prev, recipeId]);
    onBookmarkChange?.(recipeId, true);
    showToast('레시피가 저장되었어요!');
  };

  const removeBookmark = async (recipeId: number): Promise<void> => {
    await storedAPI.deleteStoredRecipe(recipeId);
    setBookmarkedRecipes(prev => prev.filter(id => id !== recipeId));
    onBookmarkChange?.(recipeId, false);
  };

  const handleError = (
    error: unknown,
    isCurrentlyBookmarked: boolean
  ): void => {
    console.error('북마크 토글 실패:', error);
    if (handleAuthError(error, router)) {
      return;
    }
    showToast(
      isCurrentlyBookmarked
        ? '북마크 제거에 실패했어요'
        : '북마크 추가에 실패했어요'
    );
  };

  const toggleBookmark = async (recipeId: number): Promise<void> => {
    if (isLoading) return;
    if (!checkAuthentication()) return;

    setIsLoading(true);
    const isCurrentlyBookmarked = bookmarkedRecipes.includes(recipeId);

    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark(recipeId);
      } else {
        await addBookmark(recipeId);
      }
    } catch (error: unknown) {
      handleError(error, isCurrentlyBookmarked);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookmarkedRecipes,
    isLoading,
    setBookmarkedRecipes,
    toggleBookmark,
  };
};
