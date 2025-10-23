import { Recipe } from '../../../apps/web/src/types/recipe.types';
import { createApiInstance } from './createApiInstance';

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

// API 인스턴스
const recipeApi = createApiInstance({ apiName: 'Recipe' });

/**
 * 레시피 관련 API
 */
export const recipe = {
  /**
   * 레시피 추천 목록 조회
   * @returns 추천 레시피 목록
   */
  getRecommendRecipes: async (): Promise<RecipeRecommendResponse> => {
    const response = await recipeApi.get<RecipeRecommendResponse>(
      '/api/recipe-recommend'
    );
    return response.data;
  },

  /**
   * 특정 레시피 상세 조회
   * @param id - 레시피 ID
   * @returns 레시피 상세 정보
   */
  getRecipeDetail: async (id: number): Promise<Recipe> => {
    const response = await recipeApi.get<Recipe>(`/api/recipe-recommend/${id}`);
    return response.data;
  },

  /**
   * 레시피 좋아요 토글
   * @param id - 레시피 ID
   * @returns 좋아요 결과
   */
  toggleRecipeLike: async (id: number): Promise<RecipeLikeResponse> => {
    const response = await recipeApi.post<RecipeLikeResponse>(
      `/api/recipe-recommend/${id}/like`
    );
    return response.data;
  },

  /**
   * 레시피 좋아요 취소
   * @param id - 레시피 ID
   * @returns 좋아요 취소 결과
   */
  unlikeRecipe: async (id: number): Promise<RecipeLikeResponse> => {
    const response = await recipeApi.delete<RecipeLikeResponse>(
      `/api/recipe-recommend/${id}/like`
    );
    return response.data;
  },

  /**
   * 선택된 재료 목록 조회
   * @returns 선택된 재료 목록
   */
  getSelectedIngredients: async (): Promise<{
    selectedIngredients: string[];
    message: string;
  }> => {
    const response = await recipeApi.get<{
      selectedIngredients: string[];
      message: string;
    }>('/api/selected-ingredients');
    return response.data;
  },

  /**
   * 선택된 재료 목록 업데이트
   * @param selectedIngredients - 선택된 재료 목록
   * @returns 업데이트 결과
   */
  updateSelectedIngredients: async (
    selectedIngredients: string[]
  ): Promise<{ selectedIngredients: string[]; message: string }> => {
    const response = await recipeApi.put<{
      selectedIngredients: string[];
      message: string;
    }>('/api/selected-ingredients', {
      selectedIngredients,
    });
    return response.data;
  },

  /**
   * 특정 레시피 조회 (요리 순서용)
   * @param id - 레시피 ID
   * @returns 레시피 정보
   */
  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await recipeApi.get<Recipe>(`/api/recipe-recommend/${id}`);
    return response.data;
  },
};
