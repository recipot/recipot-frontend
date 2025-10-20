import axios from 'axios';

import type { Food } from '@/types/food.types';

export interface FoodListResponse {
  success: boolean;
  data: Food[];
  message: string;
}

export interface SubmitSelectedFoodsRequest {
  selectedFoodIds: number[];
}

export interface SubmitSelectedFoodsResponse {
  success: boolean;
  message: string;
  data: {
    selectedFoodIds: number[];
    submittedAt: string;
  };
}

export const foodAPI = {
  // 전체 재료 목록 조회
  getFoodList: async (): Promise<Food[]> => {
    const response = await axios.get<FoodListResponse>('/api/foods');
    return response.data.data;
  },

  // 선택된 재료 전송 (레시피 추천 요청)
  submitSelectedFoods: async (
    selectedFoodIds: number[]
  ): Promise<SubmitSelectedFoodsResponse> => {
    const response = await axios.post<SubmitSelectedFoodsResponse>(
      '/api/user/selected-foods',
      { selectedFoodIds }
    );
    return response.data;
  },
};
