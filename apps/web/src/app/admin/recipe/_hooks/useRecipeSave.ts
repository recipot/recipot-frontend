import { useCallback, useState } from 'react';
import {
  type AdminRecipe,
  recipe,
  type RecipeUpdateRequest,
} from '@recipot/api';

import {
  convertToUpdateRequests,
  convertUpdateRequestToPutRequest,
} from '@/app/admin/recipe/_utils/recipeTransformer';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
import {
  isRecipeCompletelyEmpty,
  validateRecipeUpdateRequests,
} from '@/utils/recipeValidation';

interface UseRecipeSaveOptions {
  refetch: () => Promise<unknown>;
  onSuccess?: () => void;
  showToast: (message: string, duration?: number) => void;
}

interface UseRecipeSaveReturn {
  isSaving: boolean;
  validationError: {
    errorType?: 'missing';
    fieldNames?: string[];
    isOpen: boolean;
    message: string;
    showCloseButton?: boolean;
  };
  setValidationError: (error: {
    errorType?: 'missing';
    fieldNames?: string[];
    isOpen: boolean;
    message: string;
    showCloseButton?: boolean;
  }) => void;
  saveRecipes: (
    editedRecipes: Map<number, Partial<RecipeUpdateRequest>>,
    recipes: AdminRecipe[],
    getConditionId: (conditionName?: string) => number
  ) => Promise<void>;
}

interface ValidationError {
  errorType?: 'missing';
  fieldNames?: string[];
  isOpen: boolean;
  message: string;
  showCloseButton?: boolean;
}

/**
 * 레시피 검증 및 에러 처리
 */
function validateRecords(
  records: RecipeUpdateRequest[],
  setValidationError: (error: ValidationError) => void,
  setIsSaving: (value: boolean) => void
): boolean {
  if (records.length === 0) {
    return true;
  }

  const validationResult = validateRecipeUpdateRequests(records);
  if (validationResult.isValid) {
    return true;
  }

  setValidationError({
    errorType: validationResult.errorType,
    fieldNames: validationResult.fieldNames,
    isOpen: true,
    message: '',
    showCloseButton: true,
  });
  setIsSaving(false);
  return false;
}

/**
 * 레시피 API 호출
 */
async function saveRecordsToApi(
  newRecords: RecipeUpdateRequest[],
  existingRecords: RecipeUpdateRequest[]
): Promise<void> {
  if (newRecords.length > 0) {
    await recipe.updateRecipes(newRecords);
  }

  if (existingRecords.length > 0) {
    if (existingRecords.length === 1) {
      await recipe.updateRecipe(
        existingRecords[0].id,
        convertUpdateRequestToPutRequest(existingRecords[0])
      );
    } else {
      await recipe.updateRecipes(existingRecords);
    }
  }
}

/**
 * 레시피 저장 로직 관리 훅
 */
export function useRecipeSave({
  onSuccess,
  refetch,
  showToast,
}: UseRecipeSaveOptions): UseRecipeSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError>({
    errorType: undefined,
    fieldNames: [],
    isOpen: false,
    message: '',
    showCloseButton: false,
  });
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
          showCloseButton: true,
        });
        return;
      }

      setIsSaving(true);
      try {
        const savedRecipe = convertToUpdateRequests(
          editedRecipes,
          recipes,
          getConditionId
        ).filter(request => !isRecipeCompletelyEmpty(request));

        if (savedRecipe.length === 0) {
          showError({
            message: '등록할 레시피가 없습니다.',
          });
          setIsSaving(false);
          return;
        }

        const newRecords = savedRecipe.filter(recipe => recipe.id < 0);
        const existingRecords = savedRecipe.filter(recipe => recipe.id > 0);

        if (!validateRecords(newRecords, setValidationError, setIsSaving)) {
          return;
        }

        if (
          !validateRecords(existingRecords, setValidationError, setIsSaving)
        ) {
          return;
        }

        await saveRecordsToApi(newRecords, existingRecords);

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
    [onSuccess, showToast, showError]
  );

  return {
    isSaving,
    saveRecipes,
    setValidationError,
    validationError,
  };
}
