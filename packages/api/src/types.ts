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

// Admin Recipe API Types
export interface AdminRecipe {
  id: number;
  title: string;
  imageUrl?: string;
  duration: number;
  condition?: string;
  description?: string;
  tools?: {
    id: number;
    name: string;
  }[];
  ingredients?: {
    id: number;
    name: string;
    amount: string;
    isAlternative: boolean;
  }[];
  irreplaceableIngredients?: string;
  seasonings?: {
    id: number;
    name: string;
    amount: string;
  }[];
  steps?: {
    orderNum: number;
    summary: string;
    content: string;
    imageUrl?: string;
  }[];
}

export interface AdminRecipesResponse {
  data: {
    items: AdminRecipe[];
  };
}

// 레시피 수정 요청 타입
export interface RecipeUpdateRequest {
  id: number;
  title: string;
  imageUrl?: string;
  duration: number;
  conditionId: number;
  description: string;
  tools: {
    id: number;
  }[];
  ingredients: {
    id: number;
    amount: string;
    isAlternative: boolean;
  }[];
  seasonings: {
    id: number;
    amount: string;
  }[];
  steps: {
    orderNum: number;
    summary: string;
    content: string;
    imageUrl?: string;
  }[];
}

// PUT 요청용 레시피 수정 타입
export interface RecipePutRequest {
  title: string;
  description: string;
  duration: number;
  images: {
    imageUrl: string;
  }[];
  ingredients: {
    ingredientId: number;
    isAlternative: boolean;
    amount: string;
  }[];
  seasonings: {
    seasoningId: number;
    amount: string;
  }[];
  tools: {
    toolId: number;
  }[];
  steps: {
    orderNum: number;
    imageUrl?: string;
    summary: string;
    content: string;
  }[];
  healthPoints: {
    content: string;
  }[];
  conditionId: number;
}

// PUT 요청 응답 타입
export interface RecipePutResponse {
  id: number;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

// POST 요청 응답 타입
export interface RecipePostResponse {
  createdCount: number;
  updatedCount: number;
}
