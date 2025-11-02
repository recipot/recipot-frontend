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
  sessionId?: string; // Optional: not currently used
}

// Review API Types
export interface ReviewOption {
  code: string;
  codeName: string;
}

export interface ReviewData {
  recipeId: number;
  recipeName: string;
  recipeImageUrl?: string;
  completionCount: number;
  tasteOptions: ReviewOption[];
  difficultyOptions: ReviewOption[];
  experienceOptions: ReviewOption[];
  completionMessage: string;
}

export interface ReviewSubmitData {
  completedRecipeId: number;
  completionCount: number;
  completionMessage: string;
  content: string;
  difficultyCode?: string;
  experienceCode?: string;
  tasteCode?: string;
}
