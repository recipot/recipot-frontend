import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { HeartIcon } from '@/components/Icons';

interface RecipeActionsProps {
  isLiked?: boolean;
  onToggleLike: () => void;
  recipeId: number;
}

export const RecipeActions = ({
  isLiked,
  onToggleLike,
  recipeId,
}: RecipeActionsProps) => {
  const router = useRouter();

  const handleRecipeDetail = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <div className="px-5 pb-6">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-white bg-transparent hover:bg-transparent hover:text-white focus:bg-transparent focus:outline-none active:bg-transparent"
          onClick={e => {
            e.stopPropagation(); // 이벤트 전파 방지
            onToggleLike();
          }}
        >
          <HeartIcon className="h-5 w-5" color="#ffffff" active={isLiked} />
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
