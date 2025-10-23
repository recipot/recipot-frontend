import { Recipe } from '../../../apps/web/src/types/recipe.types';
import { createApiInstance } from './createApiInstance';
import { debugAuth } from './debug/debugAuth';
import type { DebugTokenRequest } from './debug/types';

export interface RecipeIngredient {
  amount: string;
  id: number;
  isAlternative: boolean;
  name: string;
}

export interface RecipeIngredients {
  owned: RecipeIngredient[];
  notOwned: RecipeIngredient[];
  alternativeUnavailable: RecipeIngredient[];
}

export interface RecipeRecommendResponse {
  recipes: Recipe[];
  message: string;
}

export interface RecipeLikeResponse {
  recipeId: number;
  liked: boolean;
  message: string;
}

export interface MeasurementGuideItem {
  standard: string;
  imageUrl: string;
  description: string;
}

export interface MeasurementGuideResponse {
  status: number;
  data: {
    data: {
      [category: string]: MeasurementGuideItem[];
    };
  };
}

// API 인스턴스
const recipeApi = createApiInstance({ apiName: 'Recipe' });

/**
 * 토큰을 사용하는 API 인스턴스 생성 헬퍼
 * @param token - 인증 토큰
 * @returns 토큰이 설정된 API 인스턴스
 */
const createTokenizedApiInstance = (token: string) => {
  const instance = createApiInstance({ apiName: 'Recipe' });

  // 요청 인터셉터에서 토큰 추가
  instance.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
};

/**
 * 레시피 관련 API
 */
export const recipe = {
  /**
   * 레시피 추천 목록 조회
   * @returns 추천 레시피 목록
   */
  getRecommendRecipes: async (): Promise<RecipeRecommendResponse> => {
    const response = await recipeApi.get<RecipeRecommendResponse>(
      '/api/recipe-recommend'
    );
    return response.data;
  },

  /**
   * 특정 레시피 상세 조회
   * @param id - 레시피 ID
   * @returns 레시피 상세 정보
   */
  getRecipeDetail: async (id: number): Promise<Recipe> => {
    const response = await recipeApi.get<Recipe>(`/api/recipe-recommend/${id}`);
    return response.data;
  },

  /**
   * 레시피 좋아요 토글
   * @param id - 레시피 ID
   * @returns 좋아요 결과
   */
  toggleRecipeLike: async (id: number): Promise<RecipeLikeResponse> => {
    const response = await recipeApi.post<RecipeLikeResponse>(
      `/api/recipe-recommend/${id}/like`
    );
    return response.data;
  },

  /**
   * 선택된 재료 목록 조회
   * @returns 선택된 재료 목록
   */
  getSelectedIngredients: async (): Promise<{
    selectedIngredients: string[];
    message: string;
  }> => {
    const response = await recipeApi.get<{
      selectedIngredients: string[];
      message: string;
    }>('/api/selected-ingredients');
    return response.data;
  },

  /**
   * 선택된 재료 목록 업데이트
   * @param selectedIngredients - 선택된 재료 목록
   * @returns 업데이트 결과
   */
  updateSelectedIngredients: async (
    selectedIngredients: string[]
  ): Promise<{ selectedIngredients: string[]; message: string }> => {
    const response = await recipeApi.put<{
      selectedIngredients: string[];
      message: string;
    }>('/api/selected-ingredients', {
      selectedIngredients,
    });
    return response.data;
  },

  /**
   * 특정 레시피 조회 (요리 순서용)
   * 자동으로 임시 토큰을 발급하여 인증된 요청을 보냅니다.
   * @param id - 레시피 ID
   * @returns 레시피 정보
   */
  getRecipe: async (id: string): Promise<Recipe> => {
    try {
      // 먼저 임시 토큰 발급 시도
      const tokenData = await debugAuth.generateDebugToken({
        role: 'user',
        userId: 1,
      });

      // 토큰을 사용하여 API 호출
      const tokenizedApi = createTokenizedApiInstance(tokenData.accessToken);
      const response = await tokenizedApi.get<Recipe>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${id}`
      );
      console.info(response.data, 'response.data with auto-generated token');
      return response.data;
    } catch (tokenError) {
      console.warn(
        'Token generation failed, falling back to basic request:',
        tokenError
      );

      // 토큰 발급에 실패하면 기본 방식으로 폴백
      const response = await recipeApi.get<Recipe>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${id}`
      );
      console.info(response.data, 'response.data (fallback)');
      return response.data;
    }
  },

  /**
   * 토큰을 사용하여 특정 레시피 조회 (요리 순서용)
   * @param id - 레시피 ID
   * @param token - 인증 토큰
   * @returns 레시피 정보
   */
  getRecipeWithToken: async (id: string, token: string): Promise<Recipe> => {
    const tokenizedApi = createTokenizedApiInstance(token);
    const response = await tokenizedApi.get<Recipe>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/recipes/${id}`
    );
    console.log(response.data, 'response.data with token');
    return response.data;
  },

  /**
   * 디버그 토큰 발급
   * @param request - 디버그 토큰 요청 정보
   * @returns 발급된 토큰 정보
   */
  generateDebugToken: async (request: DebugTokenRequest) => {
    return await debugAuth.generateDebugToken(request);
  },

  /**
   * 토큰을 사용하여 레시피 추천 목록 조회
   * @param token - 인증 토큰
   * @returns 추천 레시피 목록
   */
  getRecommendRecipesWithToken: async (
    token: string
  ): Promise<RecipeRecommendResponse> => {
    const tokenizedApi = createTokenizedApiInstance(token);
    const response = await tokenizedApi.get<RecipeRecommendResponse>(
      '/api/recipe-recommend'
    );
    return response.data;
  },

  /**
   * 토큰을 사용하여 특정 레시피 상세 조회
   * @param id - 레시피 ID
   * @param token - 인증 토큰
   * @returns 레시피 상세 정보
   */
  getRecipeDetailWithToken: async (
    id: number,
    token: string
  ): Promise<Recipe> => {
    const tokenizedApi = createTokenizedApiInstance(token);
    const response = await tokenizedApi.get<Recipe>(
      `/api/recipe-recommend/${id}`
    );
    return response.data;
  },

  /**
   * 토큰을 사용하여 레시피 좋아요 토글
   * @param id - 레시피 ID
   * @param token - 인증 토큰
   * @returns 좋아요 결과
   */
  toggleRecipeLikeWithToken: async (
    id: number,
    token: string
  ): Promise<RecipeLikeResponse> => {
    const tokenizedApi = createTokenizedApiInstance(token);
    const response = await tokenizedApi.post<RecipeLikeResponse>(
      `/api/recipe-recommend/${id}/like`
    );
    return response.data;
  },

  /**
   * 요리 시작 API
   * @param recipeId - 레시피 ID
   * @returns 요리 시작 결과
   */
  startCooking: async (recipeId: string): Promise<void> => {
    // 임시 토큰 발급
    const tokenData = await debugAuth.generateDebugToken({
      role: 'user',
      userId: 1,
    });

    // 토큰을 사용하여 API 호출
    const tokenizedApi = createTokenizedApiInstance(tokenData.accessToken);
    await tokenizedApi.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/${recipeId}/start`
    );
  },

  /**
   * 요리 완료 API
   * @param recipeId - 레시피 ID
   * @returns 요리 완료 결과
   */
  completeCooking: async (recipeId: string): Promise<void> => {
    // 임시 토큰 발급
    const tokenData = await debugAuth.generateDebugToken({
      role: 'user',
      userId: 1,
    });

    // 토큰을 사용하여 API 호출
    const tokenizedApi = createTokenizedApiInstance(tokenData.accessToken);
    await tokenizedApi.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/${recipeId}/complete`
    );
  },

  /**
   * 계량 가이드 조회 API
   * @returns 계량 가이드 데이터
   */
  getMeasurementGuides: async (): Promise<MeasurementGuideResponse> => {
    // 임시 토큰 발급
    const tokenData = await debugAuth.generateDebugToken({
      role: 'user',
      userId: 1,
    });

    // 토큰을 사용하여 API 호출
    const tokenizedApi = createTokenizedApiInstance(tokenData.accessToken);
    const response = await tokenizedApi.get<MeasurementGuideResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/measurement-guides`
    );
    return response.data;
  },
};
