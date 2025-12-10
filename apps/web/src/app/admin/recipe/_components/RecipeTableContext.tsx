'use client';

import { createContext, useContext } from 'react';

import type { RecipeUpdateRequest } from '@recipot/api';

interface RecipeTableContextValue {
  // 데이터
  availableSeasonings: Array<{ id: number; name: string }>;
  availableTools: Array<{ id: number; name: string }>;
  conditions: Array<{ id: number; name: string }>;
  editingCell: { field: string; recipeId: number } | null;
  foodList: Array<{ id: number; name: string }>;
  selectedIds: Set<number>;
  // 함수
  getConditionId: (conditionName?: string) => number;
  onSelectOne: (id: number, checked: boolean) => void;
  parseDuration: (duration: string) => number;
  setEditingCell: (cell: { field: string; recipeId: number } | null) => void;
  setImageModalState: (
    state: {
      isOpen: boolean;
      recipeId: number;
    } | null
  ) => void;
  setIngredientsModalState: (
    state: {
      isOpen: boolean;
      recipeId: number;
    } | null
  ) => void;
  setSeasoningsModalState: (
    state: {
      isOpen: boolean;
      recipeId: number;
    } | null
  ) => void;
  setStepsModalState: (
    state: {
      isOpen: boolean;
      recipeId: number;
    } | null
  ) => void;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

const RecipeTableContext = createContext<RecipeTableContextValue | null>(null);

export function useRecipeTableContext() {
  const context = useContext(RecipeTableContext);
  if (!context) {
    throw new Error(
      'useRecipeTableContext must be used within RecipeTable.Provider'
    );
  }
  return context;
}

export { RecipeTableContext };
