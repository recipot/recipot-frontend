'use client';

import { StepsEditModal } from './StepsEditModal';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface StepsModalProps {
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

export function StepsModal({
  closeModal,
  editedData,
  recipe,
  updateEditedRecipe,
}: StepsModalProps) {
  const currentSteps = editedData?.steps ?? recipe.steps ?? [];

  return (
    <StepsEditModal
      currentSteps={currentSteps}
      isOpen
      onClose={closeModal}
      onSave={steps => {
        updateEditedRecipe(recipe.id, { steps });
        closeModal();
      }}
    />
  );
}
