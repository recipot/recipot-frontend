import { createApiInstance } from './createApiInstance';

// API 인스턴스
const allergyApi = createApiInstance({ apiName: 'Allergy' });

/**
 * 못먹는 재료 목록 조회
 * @returns 백엔드에서 관리하는 재료 목록
 */
export const fetchRestrictedIngredients = async () => {
  const response = await allergyApi.get('/v1/ingredients/restricted');
  return response.data.data.data;
};

/**
 * 사용자가 선택한 못먹는 재료 저장
 * @param ingredientIds - 선택된 재료 ID 배열
 */
export const updateRestrictedIngredients = async (ingredientIds: number[]) => {
  const response = await allergyApi.post('/v1/users/ingredients/unavailable', {
    ingredientIds,
  });
  return response.data;
};
