'use client';

import { useRecipeTableActionsContext } from '../../RecipeTableActionsContext';
import { useRecipeTableDataContext } from '../../RecipeTableDataContext';
import { SeasoningsModal } from '../../SeasoningsModal';

/**
 * RecipeModals.Seasonings
 * 양념 수정 모달 컴포넌트
 */
export default function RecipeModalsSeasonings() {
  const { availableSeasonings, editedRecipes, modalState, recipes } =
    useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  if (modalState?.type !== 'seasonings') return null;

  const { recipeId } = modalState;
  const targetRecipe = recipes.find(r => r.id === recipeId);
  const editedData = editedRecipes.get(recipeId);

  if (!targetRecipe) return null;

  return (
    <SeasoningsModal
      availableSeasonings={availableSeasonings}
      closeModal={closeModal}
      editedData={editedData}
      recipe={targetRecipe}
      updateEditedRecipe={updateEditedRecipe}
    />
  );
}
