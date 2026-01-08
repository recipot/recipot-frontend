import { createApiInstance } from './createApiInstance';

export interface HealthInfo {
  content: string;
}

export interface Ingredient {
  id?: number;
  name: string;
  categoryId: number | null;
  categoryName: string;
  health_infos: HealthInfo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientCategory {
  id: number;
  name: string;
}

export interface IngredientsResponse {
  status: number;
  data: {
    data: Ingredient[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface CategoriesResponse {
  status: number;
  data: {
    data: IngredientCategory[];
  };
}

export interface GetIngredientsParams {
  page?: number;
  limit?: number;
}

export interface CreateIngredientData {
  ingredient_category_id: number | null;
  name: string;
  health_infos: HealthInfo[];
}

export interface UpdateIngredientData extends CreateIngredientData {
  id: number;
}

const ingredientApi = createApiInstance({
  apiName: 'Ingredient',
});

export const ingredientsAPI = {
  // 재료 목록 조회
  getIngredients: async (
    params: GetIngredientsParams = { page: 1, limit: 20 }
  ): Promise<IngredientsResponse['data']['data']> => {
    const response = await ingredientApi.get<IngredientsResponse>(
      '/v1/ingredients',
      { params }
    );
    return response.data.data.data;
  },

  // 재료 생성
  createIngredients: async (
    items: CreateIngredientData[]
  ): Promise<Ingredient[]> => {
    const response = await ingredientApi.post<IngredientsResponse>(
      '/v1/ingredients',
      { data: items }
    );
    return response.data.data.data;
  },

  // 재료 수정
  updateIngredients: async (
    items: UpdateIngredientData[]
  ): Promise<Ingredient[]> => {
    const response = await ingredientApi.post<IngredientsResponse>(
      '/v1/ingredients',
      { data: items }
    );
    return response.data.data.data;
  },

  // 재료 삭제
  deleteIngredient: async (id: number): Promise<void> => {
    await ingredientApi.delete(`/v1/ingredients/${id}`);
  },

  // 여러 재료 삭제
  deleteIngredients: async (ids: number[]): Promise<void> => {
    await Promise.all(
      ids.map(id => ingredientApi.delete(`/v1/ingredients/${id}`))
    );
  },
};

export const categoriesAPI = {
  // 카테고리 목록 조회
  getCategories: async (): Promise<IngredientCategory[]> => {
    const response = await ingredientApi.get<CategoriesResponse>(
      '/v1/ingredients/categories'
    );
    return response.data.data.data;
  },

  // 카테고리 생성
  createCategory: async (name: string): Promise<IngredientCategory> => {
    const response = await ingredientApi.post<CategoriesResponse>(
      '/v1/ingredients/categories',
      { data: [{ name }] }
    );
    return response.data.data.data[0];
  },

  // 카테고리 삭제 (필요시)
  deleteCategory: async (id: number): Promise<void> => {
    await ingredientApi.delete(`/v1/ingredients/categories/${id}`);
  },
};
