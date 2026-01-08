import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { HeartIcon } from '@/components/Icons';
import { useToastContext } from '@/contexts/ToastContext';
import { useBookmark } from '@/hooks/useBookmark';

interface RecipeActionsProps {
  isBookmarked?: boolean;
  onBookmarkChange?: (recipeId: number, isBookmarked: boolean) => void;
  recipeId: number;
}

export const RecipeActions = ({
  isBookmarked = false,
  onBookmarkChange,
  recipeId,
}: RecipeActionsProps) => {
  const router = useRouter();
  const { showToast } = useToastContext();

  const { toggleBookmark } = useBookmark({
    initialBookmarkedIds: isBookmarked ? [recipeId] : [],
    onBookmarkChange,
    showToast,
  });

  const handleRecipeDetail = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <div className="px-5 pb-6">
      <div className="flex justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full border border-white bg-transparent hover:bg-transparent hover:text-white focus:bg-transparent focus:outline-none active:bg-transparent"
          onClick={e => {
            e.stopPropagation(); // 이벤트 전파 방지
            toggleBookmark(recipeId);
          }}
        >
          <HeartIcon
            className="h-5 w-5"
            color="#ffffff"
            active={isBookmarked}
          />
        </Button>
        <Button
          onClick={e => {
            e.stopPropagation(); // 이벤트 전파 방지
            handleRecipeDetail(recipeId);
          }}
          className="h-[52px] flex-1 rounded-full bg-white text-gray-900"
        >
          <span className="text-17sb">요리하러 가기</span>
        </Button>
      </div>
    </div>
  );
};

RecipeActions.displayName = 'RecipeActions';
