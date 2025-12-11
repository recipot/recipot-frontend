'use client';

import { SeasoningsEditModal } from './SeasoningsEditModal';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface SeasoningsModalProps {
  availableSeasonings: Array<{ id: number; name: string }>;
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

export function SeasoningsModal({
  availableSeasonings,
  closeModal,
  editedData,
  recipe,
  updateEditedRecipe,
}: SeasoningsModalProps) {
  const currentSeasonings = editedData?.seasonings ?? recipe.seasonings ?? [];

  return (
    <SeasoningsEditModal
      availableSeasonings={availableSeasonings}
      currentSeasonings={currentSeasonings}
      isOpen
      onClose={closeModal}
      onSave={seasonings => {
        updateEditedRecipe(recipe.id, { seasonings });
        closeModal();
      }}
    />
  );
}
