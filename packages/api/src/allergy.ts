import { createApiInstance } from './createApiInstance';

// API 인스턴스
const allergyApi = createApiInstance({ apiName: 'Allergy' });

/**
 * 알레르기/못먹는 재료 관련 API
 */
export const allergy = {
  /**
   * 못먹는 재료 목록 조회
   * @returns 백엔드에서 관리하는 재료 목록
   */
  fetchRestrictedIngredients: async () => {
    const response = await allergyApi.get('/v1/ingredients/restricted');
    // 백엔드 응답 구조: { status: number, data: { data: [...] } }
    return response.data.data.data;
  },

  /**
   * 사용자가 선택한 못먹는 재료 저장
   * @param ingredientIds - 선택된 재료 ID 배열
   */
  updateRestrictedIngredients: async (ingredientIds: number[]) => {
    const response = await allergyApi.post(
      '/v1/users/ingredients/unavailable',
      {
        ingredientIds,
      }
    );
    return response.data;
  },
};
