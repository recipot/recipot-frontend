'use client';

import { createContext, useContext } from 'react';

import type { AdminRecipe, Food, RecipeUpdateRequest } from '@recipot/api';

import type { ModalType } from './RecipeModals';

/**
 * 읽기 전용 데이터 Context
 * 데이터가 변경될 때만 재렌더링
 */
interface RecipeTableDataContextValue {
  availableSeasonings: Array<{ id: number; name: string }>;
  availableTools: Array<{ id: number; name: string }>;
  conditions: Array<{ id: number; name: string }>;
  editedRecipes: Map<number, Partial<RecipeUpdateRequest>>;
  editingCell: { field: string; recipeId: number } | null;
  foodList: Food[];
  modalState: { recipeId: number; type: ModalType } | null;
  recipes: AdminRecipe[];
  selectedCell: { field: string; recipeId: number } | null;
  selectedIds: Set<number>;
  selectedRecipeId: number | null;
}

const RecipeTableDataContext =
  createContext<RecipeTableDataContextValue | null>(null);

export function useRecipeTableDataContext() {
  const context = useContext(RecipeTableDataContext);
  if (!context) {
    throw new Error(
      'useRecipeTableDataContext must be used within RecipeTableDataContext.Provider'
    );
  }
  return context;
}

export { RecipeTableDataContext };
export type { RecipeTableDataContextValue };
