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
};
