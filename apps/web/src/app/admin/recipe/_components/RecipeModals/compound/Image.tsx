'use client';

import { ImageModal } from '../../ImageModal';
import { useRecipeTableActionsContext } from '../../RecipeTableActionsContext';
import { useRecipeTableDataContext } from '../../RecipeTableDataContext';

/**
 * RecipeModals.Image
 * 이미지 수정 모달 컴포넌트
 */
export default function RecipeModalsImage() {
  const { editedRecipes, modalState, recipes } = useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  if (modalState?.type !== 'image') return null;

  const { recipeId } = modalState;
  const targetRecipe = recipes.find(r => r.id === recipeId);
  const editedData = editedRecipes.get(recipeId);

  if (!targetRecipe) return null;

  return (
    <ImageModal
      closeModal={closeModal}
      editedData={editedData}
      recipe={targetRecipe}
      updateEditedRecipe={updateEditedRecipe}
    />
  );
}
