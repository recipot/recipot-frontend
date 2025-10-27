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
};
