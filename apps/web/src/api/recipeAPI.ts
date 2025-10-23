import axios from 'axios';
import { authService, tokenUtils } from 'packages/api/src/auth';

import type { Recipe } from '@/types/recipe.types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface GetRecipeResponse {
  success: boolean;
  data: Recipe;
  message?: string;
}

export interface GetRecipesResponse {
  success: boolean;
  data: Recipe[];
  message?: string;
}

export const recipeAPI = {
  /**
   * 토큰을 가져오거나 디버그 토큰을 발급받는 헬퍼 함수
   */
  async getToken(): Promise<string> {
    const existingToken = tokenUtils.getToken();
    if (existingToken) {
      return existingToken;
    }

    // 개발 환경에서만 디버그 토큰 발급
    const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'production';
    if (APP_ENV === 'development') {
      try {
        return await authService.generateDebugToken();
      } catch (error) {
        console.error('디버그 토큰 발급 실패:', error);
        throw new Error('토큰을 가져올 수 없습니다.');
      }
    }

    throw new Error('토큰이 필요합니다.');
  },

  /**
   * 특정 레시피 조회
   */
  async getRecipe(recipeId: string): Promise<Recipe> {
    const token = await this.getToken();

    const response = await axios.get(`${BASE_URL}/v1/recipes/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('레시피를 불러오는데 실패했습니다.');
    }

    return response.data.data;
  },

  /**
   * 레시피 목록 조회
   */
  async getRecipes(): Promise<Recipe[]> {
    const token = await this.getToken();

    const response = await axios.get(`${BASE_URL}/v1/recipes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('레시피 목록을 불러오는데 실패했습니다.');
    }

    return response.data.data;
  },

  /**
   * 재료 기반 레시피 추천
   */
  async getRecommendedRecipes(ingredientIds: number[]): Promise<Recipe[]> {
    const token = await this.getToken();

    const response = await axios.post(
      `${BASE_URL}/v1/recipes/recommend`,
      { ingredientIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('추천 레시피를 불러오는데 실패했습니다.');
    }

    return response.data.data;
  },
};
