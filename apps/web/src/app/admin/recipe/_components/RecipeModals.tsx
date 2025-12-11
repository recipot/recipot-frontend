'use client';

import { ImageModal } from './ImageModal';
import { IngredientsModal } from './IngredientsModal';
import { useRecipeTableActionsContext } from './RecipeTableActionsContext';
import { useRecipeTableDataContext } from './RecipeTableDataContext';
import { SeasoningsModal } from './SeasoningsModal';
import { StepsModal } from './StepsModal';

export type ModalType = 'ingredients' | 'seasonings' | 'steps' | 'image';

/**
 * 레시피 편집 모달들을 통합 관리하는 컴포넌트
 * Context에서 필요한 데이터를 가져옵니다.
 */
export function RecipeModals() {
  const { availableSeasonings, editedRecipes, foodList, modalState, recipes } =
    useRecipeTableDataContext();
  const { closeModal, updateEditedRecipe } = useRecipeTableActionsContext();

  if (!modalState) return null;

  const { recipeId, type } = modalState;
  const targetRecipe = recipes.find(r => r.id === recipeId);
  const editedData = editedRecipes.get(recipeId);

  if (!targetRecipe) return null;

  switch (type) {
    case 'ingredients':
      return (
        <IngredientsModal
          closeModal={closeModal}
          editedData={editedData}
          foodList={foodList}
          recipe={targetRecipe}
          updateEditedRecipe={updateEditedRecipe}
        />
      );

    case 'seasonings':
      return (
        <SeasoningsModal
          availableSeasonings={availableSeasonings}
          closeModal={closeModal}
          editedData={editedData}
          recipe={targetRecipe}
          updateEditedRecipe={updateEditedRecipe}
        />
      );

    case 'steps':
      return (
        <StepsModal
          closeModal={closeModal}
          editedData={editedData}
          recipe={targetRecipe}
          updateEditedRecipe={updateEditedRecipe}
        />
      );

    case 'image':
      return (
        <ImageModal
          closeModal={closeModal}
          editedData={editedData}
          recipe={targetRecipe}
          updateEditedRecipe={updateEditedRecipe}
        />
      );

    default:
      return null;
  }
}
