import { axiosInstance } from '@/api/index';

export interface CompletedRecipe {
  id: number;
  userId: number;
  recipeId: number;
  recipeTitle: string;
  recipeDescription: string;
  recipeImages: string[];
  createdAt: string;
}

export interface CompletedRecipesResponse {
  status: number;
  data: {
    items: CompletedRecipe[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCompletedRecipesParams {
  page?: number;
  limit?: number;
}

export const recipesAPI = {
  // 완료한 요리 목록 조회
  getCompletedRecipes: async (
    params: GetCompletedRecipesParams = { limit: 10, page: 1 }
  ): Promise<CompletedRecipesResponse['data']> => {
    const response = await axiosInstance.get<CompletedRecipesResponse>(
      '/users/recipes/completed',
      { params }
    );
    return response.data.data;
  },
};
