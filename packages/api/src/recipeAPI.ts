import { createApiInstance } from '@recipot/api';

const recipeAPI = createApiInstance({ apiName: 'Recipe' });

export const recipe = {
  /**
   * 레시피 추천
   * @param conditionId - 조건 ID
   * @param selectedFoodIds - 선택된 음식 ID 배열
   * @returns
   */
  recipeRecommend: async (conditionId: number, selectedFoodIds: number[]) => {
    const response = await recipeAPI.post(`/v1/recipes/recommendations`, {
      conditionId,
      pantryIds: selectedFoodIds,
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

  getCompletedRecipeDetail: async (recipeId: string | number) => {
    const response = await recipeAPI.get(
      `/v1/reviews/preparation?completedRecipeId=${recipeId}`
    );
    return response.data?.data ?? response.data;
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
};
