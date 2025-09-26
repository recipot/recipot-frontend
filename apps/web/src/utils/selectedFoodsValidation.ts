import { mockFoods } from '@/mocks/data/foods.mock';

export interface SelectedFoodsValidationResult {
  success: boolean;
  message: string;
  data?: {
    selectedFoodIds: number[];
    submittedAt: string;
  };
}

export interface SelectedFoodsValidationError {
  success: false;
  message: string;
}

/**
 * 선택된 재료 검증 및 처리 로직
 * @param selectedFoodIds - 선택된 재료 ID 배열
 * @returns 검증 결과 및 처리된 데이터
 */
export function validateAndProcessSelectedFoods(
  selectedFoodIds: unknown
): SelectedFoodsValidationResult | SelectedFoodsValidationError {
  // 1. 기본 유효성 검사
  if (!selectedFoodIds || !Array.isArray(selectedFoodIds)) {
    return {
      message: '선택된 재료 정보가 올바르지 않습니다.',
      success: false,
    };
  }

  // 2. 최소 개수 검사
  if (selectedFoodIds.length < 2) {
    return {
      message: '재료를 2개 이상 선택해주세요.',
      success: false,
    };
  }

  // 3. 선택된 재료가 실제 존재하는지 검증
  const validFoodIds = selectedFoodIds.filter(id =>
    mockFoods.some(food => food.id === id)
  );

  if (validFoodIds.length !== selectedFoodIds.length) {
    return {
      message: '존재하지 않는 재료가 포함되어 있습니다.',
      success: false,
    };
  }

  // 4. 성공 응답
  return {
    data: {
      selectedFoodIds: validFoodIds,
      submittedAt: new Date().toISOString(),
    },
    message: '선택된 재료가 성공적으로 전송되었습니다.',
    success: true,
  };
}
