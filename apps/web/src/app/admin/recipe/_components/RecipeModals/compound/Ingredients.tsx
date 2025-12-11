'use client';

import { IngredientsModal } from '../../IngredientsModal';
import { useRecipeTableActionsContext } from '../../RecipeTableActionsContext';
import { useRecipeTableDataContext } from '../../RecipeTableDataContext';

/**
 * RecipeModals.Ingredients
 * 재료 수정 모달 컴포넌트
 */
export default function RecipeModalsIngredients() {
  const { editedRecipes, foodList, modalState, recipes } =
    useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  if (modalState?.type !== 'ingredients') return null;

  const { recipeId } = modalState;
  const targetRecipe = recipes.find(r => r.id === recipeId);
  const editedData = editedRecipes.get(recipeId);

  if (!targetRecipe) return null;

  return (
    <IngredientsModal
      closeModal={closeModal}
      editedData={editedData}
      foodList={foodList}
      recipe={targetRecipe}
      updateEditedRecipe={updateEditedRecipe}
    />
  );
}
