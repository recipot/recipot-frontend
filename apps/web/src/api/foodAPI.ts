import axios from 'axios';

import type { Food, FoodListApiResponse } from '@/types/food.types';

import type { AxiosInstance } from 'axios';

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

/**
 * Food API용 Axios 인스턴스 생성
 */
const createFoodApiInstance = (): AxiosInstance => {
  // 개발 환경에서는 Mock 서버를 사용하기 위해 baseURL을 비워둡니다
  // NEXT_PUBLIC_APP_ENV=production이면 실제 API 사용
  const shouldUseMock =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_APP_ENV !== 'production';

  const baseURL = shouldUseMock
    ? '' // MSW가 현재 도메인에서 요청을 가로챔
    : (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://api.recipot.com');

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    config => {
      if (process.env.NODE_ENV === 'development') {
        console.info(
          `[Food API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    error => {
      console.error('[Food API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    response => {
      if (process.env.NODE_ENV === 'development') {
        console.info(
          `[Food API Response] ${response.status} ${response.config.url}`
        );
      }
      return response;
    },
    error => {
      console.error(
        '[Food API Response Error]',
        error.response?.data ?? error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스
const foodApi = createFoodApiInstance();

export const foodAPI = {
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
