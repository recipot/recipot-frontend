import type { Recipe } from '@/types/recipe.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface GetRecipeResponse {
  success: boolean;
  data: Recipe;
  message?: string;
}

export interface GetRecipesResponse {
  success: boolean;
  data: Recipe[];
  message?: string;
}

export const recipeAPI = {
  /**
   * 특정 레시피 조회
   */
  async getRecipe(recipeId: string): Promise<Recipe> {
    const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}`);

    if (!response.ok) {
      throw new Error('레시피를 불러오는데 실패했습니다.');
    }

    const result: GetRecipeResponse = await response.json();
    return result.data;
  },

  /**
   * 레시피 목록 조회
   */
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${BASE_URL}/api/recipes`);

    if (!response.ok) {
      throw new Error('레시피 목록을 불러오는데 실패했습니다.');
    }

    const result: GetRecipesResponse = await response.json();
    return result.data;
  },

  /**
   * 재료 기반 레시피 추천
   */
  async getRecommendedRecipes(ingredientIds: number[]): Promise<Recipe[]> {
    const response = await fetch(`${BASE_URL}/api/recipes/recommend`, {
      body: JSON.stringify({ ingredientIds }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('추천 레시피를 불러오는데 실패했습니다.');
    }

    const result: GetRecipesResponse = await response.json();
    return result.data;
  },
};
