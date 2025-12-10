'use client';

import { createContext, useContext } from 'react';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface CurrentValues {
  conditionId: number;
  description: string;
  duration: string | number;
  imageUrl: string | undefined;
  ingredients: Array<{
    id: number;
    amount: string;
    isAlternative: boolean;
  }>;
  seasonings: Array<{
    id: number;
    amount: string;
  }>;
  steps: Array<{
    content: string;
    orderNum: number;
    summary?: string;
    imageUrl?: string;
  }>;
  title: string;
  tools: Array<{ id: number }>;
}

interface RecipeRowContextValue {
  currentValues: CurrentValues;
  editedData?: Partial<RecipeUpdateRequest>;
  isEditing: (field: string) => boolean;
  recipeItem: AdminRecipe;
}

const RecipeRowContext = createContext<RecipeRowContextValue | null>(null);

export function useRecipeRowContextWithTable() {
  const context = useContext(RecipeRowContext);
  if (!context) {
    throw new Error(
      'useRecipeRowContextWithTable must be used within RecipeRowContext.Provider'
    );
  }
  return context;
}

export { RecipeRowContext };
