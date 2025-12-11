'use client';

import { ImageEditModal } from './ImageEditModal';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface ImageModalProps {
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

export function ImageModal({
  closeModal,
  editedData,
  recipe,
  updateEditedRecipe,
}: ImageModalProps) {
  const currentImageUrl = editedData?.imageUrl ?? recipe.imageUrl;

  return (
    <ImageEditModal
      columnName="대표 이미지"
      currentImageUrl={currentImageUrl}
      isOpen
      onClose={closeModal}
      onSave={imageUrl => {
        updateEditedRecipe(recipe.id, { imageUrl });
        closeModal();
      }}
    />
  );
}
