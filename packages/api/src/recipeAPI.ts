import { createApiInstance } from '@recipot/api';

import type {
  AdminRecipesResponse,
  RecipeIngredientsResponse,
  RecipePostResponse,
  RecipePutRequest,
  RecipePutResponse,
  RecipeSeasoningsResponse,
  RecipeToolsResponse,
  RecipeUpdateRequest,
  ReviewSubmitData,
} from './types';

const recipeAPI = createApiInstance({ apiName: 'Recipe' });

export const recipe = {
  /**
   * 레시피 추천
   * @param conditionId - 조건 ID
   * @param selectedFoodIds - 선택된 음식 ID 배열
   * @param page - 페이지 번호 (기본값: 1)
   * @returns
   */
  recipeRecommend: async (
    conditionId: number,
    selectedFoodIds: number[],
    page: number = 1
  ) => {
    const response = await recipeAPI.post(`/v1/recipes/recommendations`, {
      conditionId,
      pantryIds: selectedFoodIds,
      page,
    });
    return response.data;
  },

  getMyProfile: async () => {
    const response = await recipeAPI.get(`/v1/users/profile/me`);
    return response.data.data;
  },

  getRecipeDetail: async (recipeId: string | number) => {
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}`);
    return response.data.data;
  },

  getPublicRecipeDetail: async (recipeId: string | number) => {
    const response = await recipeAPI.get(`/v1/recipes/public/${recipeId}`);
    return response.data.data;
  },

  postRecipeReview: async (data: ReviewSubmitData) => {
    return await recipeAPI.post(`/v1/reviews`, data);
  },

  getCompletedRecipeDetail: async (recipeId: string | number) => {
    const response = await recipeAPI.get(
      `/v1/reviews/preparation?completedRecipeId=${recipeId}`
    );
    return response.data.data;
  },

  startCooking: async (recipeId: string | number) => {
    const response = await recipeAPI.post(
      `/v1/users/recipes/${recipeId}/start`,
      { recipeId }
    );
    return response.data?.data?.completedRecipeId;
  },

  completeCooking: async (recipeId: string | number) => {
    await recipeAPI.post(`/v1/users/recipes/${recipeId}/complete`, {
      recipeId,
    });
  },

  /**
   * 모든 레시피 조회 (어드민)
   * @returns
   */
  getAllAdminRecipes: async (): Promise<AdminRecipesResponse['data']> => {
    const response = await recipeAPI.get(`/v1/recipes`);
    return response.data.data;
  },

  /**
   * 특정 레시피 수정 (어드민) - PUT
   * @param recipeId - 레시피 ID
   * @param recipe - 수정할 레시피 데이터 (전체 필드 포함)
   * @returns
   */
  updateRecipe: async (
    recipeId: number,
    recipe: RecipePutRequest
  ): Promise<RecipePutResponse> => {
    const response = await recipeAPI.put(`/v1/recipes/${recipeId}`, recipe);
    return response.data.data;
  },

  /**
   * 레시피 수정 (어드민) - POST (배열로 여러 레시피를 한 번에 처리)
   * @param recipes - 수정할 레시피 배열
   * @returns
   */
  updateRecipes: async (
    recipes: RecipeUpdateRequest[]
  ): Promise<RecipePostResponse> => {
    const response = await recipeAPI.post(`/v1/recipes`, recipes);
    return response.data.data;
  },

  /**
   * 레시피 재료 조회 (어드민)
   * @param recipeId - 레시피 ID
   * @returns
   */
  getRecipeIngredients: async (
    recipeId: number
  ): Promise<RecipeIngredientsResponse> => {
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}/ingredients`);

    return response.data.data;
  },

  /**
   * 레시피 양념 조회 (어드민)
   * @param recipeId - 레시피 ID
   * @returns
   */
  getRecipeSeasonings: async (
    recipeId: number
  ): Promise<RecipeSeasoningsResponse> => {
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}/seasonings`);
    return response.data.data;
  },

  /**
   * 레시피 조리도구 조회 (어드민)
   * @param recipeId - 레시피 ID
   * @returns
   */
  getRecipeTools: async (recipeId: number): Promise<RecipeToolsResponse> => {
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}/tools`);
    return response.data.data;
  },
};
