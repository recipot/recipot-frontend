import { Recipe } from '../../../apps/web/src/types/recipe.types';
import { createApiInstance } from './createApiInstance';
import { debugAuth } from './debug/debugAuth';
import type { DebugTokenRequest } from './debug/types';

export interface RecipeIngredient {
  amount: string;
  id: number;
  isAlternative: boolean;
  name: string;
}

export interface RecipeIngredients {
  owned: RecipeIngredient[];
  notOwned: RecipeIngredient[];
  alternativeUnavailable: RecipeIngredient[];
}

export interface RecipeRecommendResponse {
  recipes: Recipe[];
  message: string;
}

export interface RecipeLikeResponse {
  recipeId: number;
  liked: boolean;
  message: string;
}

export interface MeasurementGuideItem {
  standard: string;
  imageUrl: string;
  description: string;
}

export interface MeasurementGuideResponse {
  status: number;
  data: {
    data: {
      [category: string]: MeasurementGuideItem[];
    };
  };
}
