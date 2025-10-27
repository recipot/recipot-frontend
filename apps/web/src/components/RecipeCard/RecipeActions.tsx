import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { CookIcon, HeartIcon } from '@/components/Icons';

interface RecipeActionsProps {
  isLiked?: boolean;
  onToggleLike: () => void;
}

export const RecipeActions = ({
  isLiked,
  onToggleLike,
}: RecipeActionsProps) => {
  const router = useRouter();

  const handleExploreComplete = () => {
    router.push('/complete');
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
            handleExploreComplete();
          }}
          className="h-[52px] flex-1 rounded-full bg-white text-gray-900"
        >
          <CookIcon className="mr-2 h-[18px] w-[18px]" color="#212529" />
          <span className="text-17sb">요리하러 가기</span>
        </Button>
      </div>
    </div>
  );
};

RecipeActions.displayName = 'RecipeActions';
