'use client';

import { IngredientsEditModal } from './IngredientsEditModal';

import type { AdminRecipe, Food, RecipeUpdateRequest } from '@recipot/api';

interface IngredientsModalProps {
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  foodList: Food[];
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

export function IngredientsModal({
  closeModal,
  editedData,
  foodList,
  recipe,
  updateEditedRecipe,
}: IngredientsModalProps) {
  const currentIngredients =
    editedData?.ingredients ?? recipe.ingredients ?? [];

  return (
    <IngredientsEditModal
      availableFoods={foodList}
      currentIngredients={currentIngredients}
      isOpen
      onClose={closeModal}
      onSave={ingredients => {
        updateEditedRecipe(recipe.id, { ingredients });
        closeModal();
      }}
    />
  );
}
