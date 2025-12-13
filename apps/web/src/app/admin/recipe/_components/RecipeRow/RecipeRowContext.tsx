'use client';

import { createContext, useContext } from 'react';

import type {
  CookingStep,
  Ingredient,
  Seasoning,
} from '@/app/recipe/[id]/types/recipe.types';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface CurrentValues {
  conditionId: number;
  description: string;
  duration: string | number;
  imageUrl: string | undefined;
  ingredients: Omit<Ingredient, 'name'>[];
  seasonings: Omit<Seasoning, 'name'>[];
  steps: Omit<CookingStep, 'step'>[];
  title: string;
  tools: { id: number }[];
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
