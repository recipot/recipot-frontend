/**
 * 백엔드 API 응답 타입
 */
export interface Food {
  categoryId: number;
  categoryName: string;
  id: number;
  isUserRestricted: boolean;
  name: string;
}

/**
 * 백엔드 API 응답 래퍼
 */
export interface FoodListApiResponse {
  data: {
    data: Food[];
  };
  status: number;
}

export interface SelectedFoodsStore {
  selectedFoodIds: number[];
  userId: string | null;
  toggleFood: (foodId: number) => void;
  clearAllFoods: () => void;
  isSelected: (foodId: number) => boolean;
  getSelectedCount: () => number;
  getSelectedFoods: (foodList: Food[]) => Food[];
  validateUserSession: (currentUserId: string | null) => void;
}
