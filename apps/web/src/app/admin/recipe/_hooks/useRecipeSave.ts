import { useCallback, useState } from 'react';
import {
  type AdminRecipe,
  recipe,
  type RecipeUpdateRequest,
} from '@recipot/api';

import { useToast } from '@/hooks/useToast';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
import {
  formatValidationErrors,
  isRecipeCompletelyEmpty,
  validateRecipeUpdateRequests,
} from '@/utils/recipeValidation';

import {
  convertToUpdateRequests,
  convertUpdateRequestToPutRequest,
} from '../_utils/recipeTransformer';

interface UseRecipeSaveOptions {
  refetch: () => Promise<unknown>;
  onSuccess?: () => void;
}

interface UseRecipeSaveReturn {
  isSaving: boolean;
  validationError: { isOpen: boolean; message: string };
  setValidationError: (error: { isOpen: boolean; message: string }) => void;
  saveRecipes: (
    editedRecipes: Map<number, Partial<RecipeUpdateRequest>>,
    recipes: AdminRecipe[],
    getConditionId: (conditionName?: string) => number
  ) => Promise<void>;
}

/**
 * 레시피 저장 로직 관리 훅
 */
export function useRecipeSave({
  onSuccess,
  refetch,
}: UseRecipeSaveOptions): UseRecipeSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });
  const { showToast } = useToast();
  const { showError } = useApiErrorModalStore();

  const saveRecipes = useCallback(
    async (
      editedRecipes: Map<number, Partial<RecipeUpdateRequest>>,
      recipes: AdminRecipe[],
      getConditionId: (conditionName?: string) => number
    ) => {
      if (editedRecipes.size === 0) {
        setValidationError({
          isOpen: true,
          message: '수정된 레시피가 없습니다.',
        });
        return;
      }

      setIsSaving(true);
      try {
        const updateRequests = convertToUpdateRequests(
          editedRecipes,
          recipes,
          getConditionId
        );
        const validRequests = updateRequests.filter(
          request => !isRecipeCompletelyEmpty(request)
        );

        if (validRequests.length === 0) {
          showError({
            message: '등록할 레시피가 없습니다.',
          });
          setIsSaving(false);
          return;
        }

        const validationResult = validateRecipeUpdateRequests(validRequests);
        if (!validationResult.isValid) {
          const errorMessages = formatValidationErrors(validationResult.errors);
          setValidationError({
            isOpen: true,
            message: errorMessages.join('\n'),
          });
          setIsSaving(false);
          return;
        }

        if (validRequests.length === 1) {
          await recipe.updateRecipe(
            validRequests[0].id,
            convertUpdateRequestToPutRequest(validRequests[0])
          );
        } else {
          await recipe.updateRecipes(validRequests);
        }

        showToast('레시피가 성공적으로 저장되었습니다.');
        await refetch();
        onSuccess?.();
      } catch (error) {
        console.error('레시피 저장 실패:', error);
        showError({
          message: '레시피 저장 중 오류가 발생했습니다.',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [refetch, onSuccess, showToast, showError]
  );

  return {
    isSaving,
    saveRecipes,
    setValidationError,
    validationError,
  };
}
