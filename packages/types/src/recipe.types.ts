/**
 * Recipe 도메인 타입 정의
 *
 * 이 파일은 레시피 관련 모든 타입의 단일 진실의 원천(Single Source of Truth)입니다.
 * apps/web/src/app/recipe/[id]/types/recipe.types.ts의 타입을 통합한 것입니다.
 */

// ============================================================================
// 기본 엔티티
// ============================================================================

export interface Ingredient {
  id: number;
  name: string;
  amount: string;
  isAlternative: boolean;
}

export interface Seasoning {
  id: number;
  name: string;
  amount: string;
}

export interface Cookware {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface CookingStep {
  description: string;
  orderNum: number;
  step: number;
  summary: string;
  imageUrl?: string | null;
}

export interface HealthPoint {
  content: string;
}

export interface Condition {
  id: number;
  name: string;
}

// ============================================================================
// 그룹/복합 타입
// ============================================================================

export interface IngredientsGroup {
  owned: Ingredient[];
  notOwned: Ingredient[];
  alternativeUnavailable: Ingredient[];
}

export interface RecipeIngredients {
  owned?: RecipeIngredient[];
  notOwned?: RecipeIngredient[];
  alternativeUnavailable?: RecipeIngredient[];
}

export interface RecipeIngredient {
  amount: string;
  id: number;
  isAlternative: boolean;
  name: string;
}

// ============================================================================
// 메인 타입
// ============================================================================

export interface Recipe {
  description: string;
  duration: string;
  healthPoint?: HealthPoint;
  images: {
    id: number;
    imageUrl: string;
  }[];
  id: number;
  title: string;
  tools: Cookware[];
  seasonings: Seasoning[];
  isBookmarked: boolean;
  ingredients: IngredientsGroup;
  steps: CookingStep[];
}

// ============================================================================
// UI 전용 타입
// ============================================================================

export interface RecipeCard {
  id: string;
  title: string;
  time: string;
  image: string;
}

export interface RecipeDetailProps {
  recipe: Recipe;
}

export type TabId = 'ingredients' | 'cookware' | 'steps';

export interface RecommendationItem {
  recipeId: number;
  title: string;
  description: string;
  imageUrls: string[];
  duration: string;
  tools: Cookware[] | string[];
  isBookmarked: boolean;
}

// ============================================================================
// API 응답 타입
// ============================================================================

export interface ApiResponse {
  success: boolean;
  data: Recipe;
  message: string;
}

export interface RecipeRecommendResponse {
  recipes: Recipe[];
  message: string;
}

export interface RecommendationResponse {
  data: {
    items: RecommendationItem[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface RecipeLikeResponse {
  recipeId: number;
  liked: boolean;
  message: string;
}

export interface ConditionsResponse {
  status: number;
  data: {
    conditions: Condition[];
  };
}

export interface PendingReviewsResponse {
  data: {
    completedRecipeIds: number[];
    totalCount: number;
  };
}
