import axios from 'axios';

/**
 * 일일 컨디션 저장 요청 타입
 */
export interface SaveDailyConditionRequest {
  conditionId: number;
  isRecommendationStarted: boolean;
}

/**
 * 일일 컨디션 저장 응답 타입
 */
export interface SaveDailyConditionResponse {
  success: boolean;
  message: string;
  data?: {
    conditionId: number;
    createdAt: string;
  };
}

/**
 * 컨디션 관련 API
 */
export const condition = {
  /**
   * 일일 컨디션 저장
   * @param data - 컨디션 데이터
   * @returns 저장 결과
   */
  saveDailyCondition: async (
    data: SaveDailyConditionRequest
  ): Promise<SaveDailyConditionResponse> => {
    try {
      console.info('🚀 일일 컨디션 저장 요청:', data);

      const response = await axios.post<SaveDailyConditionResponse>(
        '/v1/user/conditions/daily',
        data
      );

      console.info('✅ 일일 컨디션 저장 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 일일 컨디션 저장 실패:', error);

      // 에러 메시지 정제
      let errorMessage = '컨디션 저장 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = '입력 데이터에 오류가 있습니다.';
        } else if (error.response && error.response.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = '네트워크 연결을 확인해주세요.';
        }
      }

      throw new Error(errorMessage);
    }
  },
};
