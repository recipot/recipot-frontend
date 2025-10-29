/**
 * API 관련 공통 타입 정의
 */

// Food API Types
export interface Food {
  categoryId: number;
  categoryName: string;
  id: number;
  isUserRestricted: boolean;
  name: string;
}

export interface FoodListApiResponse {
  data: {
    data: Food[];
  };
  status: number;
}

// Onboarding API Types
export interface CompleteOnboardingData {
  allergies: number[];
  mood: string;
  selectedFoods: number[];
  sessionId: string;
}

// Recipe API Types
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
  imageUrl: string;
}

export interface CookingStep {
  orderNum: number;
  summary: string;
}

export interface HealthPoint {
  content: string;
}

export interface Condition {
  id: number;
  name: string;
}

export interface IngredientsGroup {
  owned: Ingredient[];
  notOwned: Ingredient[];
  alternativeUnavailable: Ingredient[];
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  duration: string;
  images: {
    id: number;
    imageUrl: string;
  }[];
  ingredients: IngredientsGroup;
  seasonings: Seasoning[];
  tools: Cookware[];
  steps?: CookingStep[] | undefined;
  healthPoints: HealthPoint[];
  isBookmarked: boolean;
}

export interface RecipeDetailResponse {
  status: number;
  data: Recipe;
}

export interface StartCookingResponse {
  status: number;
  data: {
    message: string;
  };
}

export interface CompleteCookingResponse {
  status: number;
  data: {
    message: string;
  };
}
