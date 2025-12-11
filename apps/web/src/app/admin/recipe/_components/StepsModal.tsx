'use client';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

import { StepsEditModal } from './StepsEditModal';

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

