import { createApiInstance } from './createApiInstance';
import { debugAuth } from './debug';

export interface CompletedRecipe {
  id: number;
  userId: number;
  recipeId: number;
  recipeTitle: string;
  recipeDescription: string;
  recipeImages: string[];
  createdAt: string;
  isReviewed?: number;
  isCompleted?: number;
  isBookmarked?: boolean;
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

const mypageApi = createApiInstance({
  apiName: 'Mypage',
});

export const recipesAPI = {
  // 완료한 요리 목록 조회
  getCompletedRecipes: async (
    params: GetCompletedRecipesParams = { limit: 10, page: 1 }
  ): Promise<CompletedRecipesResponse['data']> => {
    const response = await mypageApi.get<CompletedRecipesResponse>(
      '/v1/users/recipes/completed',
      { params }
    );
    return response.data.data;
  },
};

export const storedAPI = {
  // 보관한 레시피 목록 조회
  getStoredRecipes: async (
    params: GetCompletedRecipesParams = { limit: 10, page: 1 }
  ): Promise<CompletedRecipesResponse['data']> => {
    const response = await mypageApi.get<CompletedRecipesResponse>(
      '/v1/users/recipes/bookmarks',
      { params }
    );
    return response.data.data;
  },

  // 보관한 레시피 삭제 (북마크 해제)
  deleteStoredRecipe: async (recipeId: number): Promise<void> => {
    await mypageApi.delete(`/v1/users/recipes/bookmarks/${recipeId}`);
  },

  // 보관한 레시피 추가 (북마크 등록)
  postStoredRecipe: async (recipeId: number): Promise<void> => {
    await mypageApi.post(`/v1/users/recipes/bookmarks`, { recipeId });
  },
};

export const recentAPI = {
  // 최근 본 레시피 목록 조회
  getRecentRecipes: async (
    params: GetCompletedRecipesParams = { limit: 10, page: 1 }
  ): Promise<CompletedRecipesResponse['data']> => {
    const response = await mypageApi.get<CompletedRecipesResponse>(
      '/v1/users/recipes/recent',
      { params }
    );
    return response.data.data;
  },

  // 최근 본 레시피 추가
  postRecentRecipe: async (recipeId: number): Promise<void> => {
    await mypageApi.post(`/v1/users/recipes/recent/${recipeId}`);
  },
};
