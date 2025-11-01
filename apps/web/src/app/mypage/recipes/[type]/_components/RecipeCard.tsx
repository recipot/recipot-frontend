import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { ArrowIcon, HeartIcon } from '@/components/Icons';
import { useDeleteStoredRecipe } from '@/hooks/useDeleteSavedRecipe';
import { usePostStoredRecipe } from '@/hooks/usePostSavedRecipe';

import type { CompletedRecipe } from '@recipot/api';

interface RecipeCardProps {
  recipe: CompletedRecipe;
  isSavedRecipe?: boolean;
  onToggleSave?: () => void;
}

type ModalType = 'save' | 'unsave' | null;

export default function RecipeCard({
  isSavedRecipe = false,
  onToggleSave,
  recipe,
}: RecipeCardProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const { isPending: isDeleting, mutate: deleteRecipe } =
    useDeleteStoredRecipe();
  const { isPending: isSaving, mutate: saveRecipe } = usePostStoredRecipe();

  // saved 타입일 때는 항상 true, 아닐 때는 recipe.isBookmarked 값 사용
  const isBookmarked = isSavedRecipe ? true : (recipe.isBookmarked ?? false);

  const handleHeartClick = () => {
    if (isBookmarked) {
      // 북마크 해제 모달
      setModalType('unsave');
    } else {
      // 북마크 등록 모달
      setModalType('save');
    }
  };

  const handleConfirmSave = () => {
    saveRecipe(recipe.recipeId, {
      onSuccess: () => {
        setModalType(null);
        onToggleSave?.();
      },
    });
  };

  const handleConfirmUnsave = () => {
    deleteRecipe(recipe.recipeId, {
      onSuccess: () => {
        setModalType(null);
        onToggleSave?.();
      },
    });
  };

  const isPending = isDeleting || isSaving;

  const modalConfig = {
    save: {
      confirmText: '보관하기',
      description: '레시피를 보관하시겠어요?',
      onConfirm: handleConfirmSave,
    },
    unsave: {
      confirmText: '삭제하기',
      description: '보관한 레시피에서 삭제하시겠어요?',
      onConfirm: handleConfirmUnsave,
    },
  };

  const currentModalConfig = modalType ? modalConfig[modalType] : null;

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
          <Link
            href={`/recipe/${recipe.recipeId}`}
            className="flex items-center text-left"
          >
            <h3 className="text-17sb text-gray-900">{recipe.recipeTitle}</h3>
            <ArrowIcon size={18} color="hsl(var(--gray-900))" />
          </Link>
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
            active={isBookmarked}
            color="hsl(var(--brand-primary))"
          />
        </button>
      </div>

      {currentModalConfig && (
        <Modal
          open={modalType !== null}
          onOpenChange={open => !open && setModalType(null)}
          description={currentModalConfig.description}
          contentGap={24}
        >
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="full"
              onClick={() => setModalType(null)}
              disabled={isPending}
              className="text-15sb h-10 py-[0.5313rem]"
            >
              취소
            </Button>
            <Button
              variant="default"
              size="full"
              onClick={currentModalConfig.onConfirm}
              disabled={isPending}
              className="text-15sb h-10 py-[0.5313rem]"
            >
              {isPending ? '처리중...' : currentModalConfig.confirmText}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
