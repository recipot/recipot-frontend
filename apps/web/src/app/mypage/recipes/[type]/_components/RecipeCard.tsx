import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { ArrowIcon, HeartIcon } from '@/components/Icons';
import { useDeleteStoredRecipe } from '@/hooks/useDeleteSavedRecipe';
import { usePostStoredRecipe } from '@/hooks/usePostSavedRecipe';

import type { CompletedRecipe } from '@recipot/api';

interface RecipeCardProps {
  recipe: CompletedRecipe;
  isSavedRecipe?: boolean;
  onToggleSave?: (recipeId: number) => void;
}

export default function RecipeCard({ onToggleSave, recipe }: RecipeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPending: isDeleting, mutate: deleteRecipe } =
    useDeleteStoredRecipe();
  const { isPending: isSaving, mutate: saveRecipe } = usePostStoredRecipe();
  const isSaved = recipe.isSaved ?? false;

  const handleHeartClick = () => {
    if (isSaved) {
      setIsModalOpen(true);
    } else {
      // 최근 본 레시피인 경우 바로 토글
      saveRecipe(recipe.recipeId, {
        onSuccess: () => {
          onToggleSave?.(recipe.id);
        },
      });
    }
  };

  const handleConfirmUnsave = () => {
    deleteRecipe(recipe.recipeId, {
      onSuccess: () => {
        setIsModalOpen(false);
        onToggleSave?.(recipe.id);
      },
    });
  };

  const isPending = isDeleting || isSaving;

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3">
        <div className="relative h-[3.75rem] w-[3.75rem] flex-shrink-0">
          <Image
            src={recipe.recipeImages[0] ?? '/placeholder-image.png'}
            alt={recipe.recipeTitle ?? '레시피 이미지'}
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-grow flex-col justify-between gap-1">
          <div className="flex items-center">
            <h3 className="text-17sb text-gray-900">{recipe.recipeTitle}</h3>
            <ArrowIcon size={18} color="hsl(var(--gray-900))" />
          </div>
          <p className="text-14 truncate text-gray-600">
            {recipe.recipeDescription}
          </p>
        </div>
        <button
          onClick={handleHeartClick}
          className="flex-shrink-0"
          disabled={isPending}
        >
          <HeartIcon
            size={20}
            active={isSaved}
            color="hsl(var(--brand-primary))"
          />
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        description="보관한 레시피에서 삭제하시겠어요?"
        contentGap={24}
      >
        <div className="flex items-center justify-end gap-[0.375rem]">
          <Button
            className="text-14 h-[2.125rem] border border-[#747474] bg-white px-[0.9375rem] py-3 text-black disabled:opacity-50"
            shape="square"
            onClick={handleConfirmUnsave}
            disabled={isPending}
          >
            {isDeleting ? '처리중...' : '해제하기'}
          </Button>
          <Button
            className="text-14b h-[2.125rem] bg-[#747474] px-4 py-3 text-white disabled:opacity-50"
            shape="square"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}
