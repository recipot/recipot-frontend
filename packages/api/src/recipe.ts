import { createApiInstance } from '@recipot/api';
import type {
  Recipe,
  StartCookingResponse,
  CompleteCookingResponse,
} from './types';

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

  /**
   * 레시피 상세 조회
   * @param recipeId - 레시피 ID
   * @returns 레시피 상세 정보
   */
  getRecipeDetail: async (recipeId: number): Promise<Recipe> => {
    const response = await recipeAPI.get(`/v1/recipes/${recipeId}`);
    return response.data.data;
  },

  /**
   * 요리 시작
   * @param recipeId - 레시피 ID
   * @returns 요리 시작 응답
   */
  startCooking: async (recipeId: number): Promise<StartCookingResponse> => {
    const response = await recipeAPI.post(
      `/v1/users/recipes/${recipeId}/start`,
      {
        recipeId,
      }
    );
    return response.data;
  },

  /**
   * 요리 완료
   * @param recipeId - 레시피 ID
   * @returns 요리 완료 응답
   */
  completeCooking: async (
    recipeId: number
  ): Promise<CompleteCookingResponse> => {
    const response = await recipeAPI.post(
      `/v1/users/recipes/${recipeId}/complete`,
      {
        recipeId,
      }
    );
    return response.data;
  },

  toggleBookmark: async (recipeId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      // DELETE 요청
      const response = await recipeAPI.delete(
        `/v1/users/recipes/bookmarks/${recipeId}`
      );
      return response.data;
    } else {
      // POST 요청
      const response = await recipeAPI.post(`/v1/users/recipes/bookmarks`, {
        recipeId,
      });
      return response.data;
    }
  },
};
