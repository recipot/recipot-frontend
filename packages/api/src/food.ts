import type { Food, FoodListApiResponse } from './types';

import { createApiInstance } from './createApiInstance';

export interface SubmitSelectedFoodsRequest {
  selectedFoodIds: number[];
}

export interface SubmitSelectedFoodsResponse {
  data: {
    message: string;
    selectedFoodIds: number[];
    submittedAt: string;
  };
  status: number;
}

// API 인스턴스
const foodApi = createApiInstance({ apiName: 'Food' });

/**
 * 재료(Food) 관련 API
 */
export const food = {
  /**
   * 전체 재료 목록 조회
   * @returns 재료 목록 배열
   */
  getFoodList: async (): Promise<Food[]> => {
    const response = await foodApi.get<FoodListApiResponse>('/v1/ingredients');
    return response.data.data.data;
  },

  /**
   * 선택된 재료 전송 (레시피 추천 요청)
   * @param selectedFoodIds - 선택된 재료 ID 배열
   */
  submitSelectedFoods: async (
    selectedFoodIds: number[]
  ): Promise<SubmitSelectedFoodsResponse> => {
    const response = await foodApi.post<SubmitSelectedFoodsResponse>(
      '/api/user/selected-foods',
      { selectedFoodIds }
    );
    return response.data;
  },
};
