export interface HealthInfo {
  content: string;
}

export interface Ingredient {
  id: number;
  name: string; // 재료
  categoryId: number | null; // 대분류 ID
  categoryName: string; // 대분류 이름 (UI용)
  health_infos: HealthInfo[]; // 건강 정보 배열
  isNew?: boolean;
  isModified?: boolean;
}

export interface IngredientCategory {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  status: number;
  data: {
    data: T;
  };
}

export interface CreateIngredientRequest {
  data: Array<{
    ingredient_category_id: number;
    name: string;
    health_infos: HealthInfo[];
  }>;
}

export interface CreateCategoryRequest {
  data: Array<{
    name: string;
  }>;
}
