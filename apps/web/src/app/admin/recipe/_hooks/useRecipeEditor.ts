import { useCallback, useState } from 'react';

import type { RecipeUpdateRequest } from '@recipot/api';

interface UseRecipeEditorReturn {
  editedRecipes: Map<number, Partial<RecipeUpdateRequest>>;
  editingCell: { field: string; recipeId: number } | null;
  selectedCell: { field: string; recipeId: number } | null;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
  setEditingCell: (cell: { field: string; recipeId: number } | null) => void;
  setSelectedCell: (cell: { field: string; recipeId: number } | null) => void;
  clearEdits: () => void;
}

/**
 * 레시피 편집 상태 관리 훅
 */
export function useRecipeEditor(): UseRecipeEditorReturn {
  const [editedRecipes, setEditedRecipes] = useState<
    Map<number, Partial<RecipeUpdateRequest>>
  >(new Map());
  const [editingCell, setEditingCell] = useState<{
    field: string;
    recipeId: number;
  } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{
    field: string;
    recipeId: number;
  } | null>(null);

  const updateEditedRecipe = useCallback(
    (recipeId: number, updates: Partial<RecipeUpdateRequest>) => {
      setEditedRecipes(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(recipeId) ?? {};
        newMap.set(recipeId, { ...existing, ...updates });
        return newMap;
      });
    },
    []
  );

  const clearEdits = useCallback(() => {
    setEditedRecipes(new Map());
  }, []);

  return {
    clearEdits,
    editedRecipes,
    editingCell,
    selectedCell,
    setEditingCell,
    setSelectedCell,
    updateEditedRecipe,
  };
}
