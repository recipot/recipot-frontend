import type { AxiosRequestConfig } from 'axios';
import { createApiInstance } from '@recipot/api';

import type { ReviewSubmitData } from './types';

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
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}`, {
      suppressGlobalError: true,
    } as AxiosRequestConfig & { suppressGlobalError: boolean });
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
};
