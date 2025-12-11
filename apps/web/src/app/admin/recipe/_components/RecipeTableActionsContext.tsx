'use client';

import { createContext, useContext } from 'react';

import type { ModalType } from './RecipeModals';
import type { RecipeUpdateRequest } from '@recipot/api';

/**
 * 액션 함수들 Context
 * 함수는 거의 변경되지 않으므로 성능 최적화에 유리
 */
interface RecipeTableActionsContextValue {
  closeModal: () => void;
  getConditionId: (conditionName?: string) => number;
  onSelectOne: (id: number, checked: boolean) => void;
  openModal: (type: ModalType, recipeId: number) => void;
  setEditingCell: (cell: { field: string; recipeId: number } | null) => void;
  setSelectedCell: (cell: { field: string; recipeId: number } | null) => void;
  setSelectedRecipeId: (id: number | null) => void;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

const RecipeTableActionsContext =
  createContext<RecipeTableActionsContextValue | null>(null);

export function useRecipeTableActionsContext() {
  const context = useContext(RecipeTableActionsContext);
  if (!context) {
    throw new Error(
      'useRecipeTableActionsContext must be used within RecipeTableActionsContext.Provider'
    );
  }
  return context;
}

export { RecipeTableActionsContext };
export type { RecipeTableActionsContextValue };
