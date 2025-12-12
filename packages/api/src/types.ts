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
  imageUrl: string;
  duration: number;
  condition: string;
  description: string;
  tools?: {
    id: number;
    name: string;
  }[];
  ingredients: {
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
  imageUrl: string;
  duration: number;
  conditionId: number;
  description: string;
  tools: {
    id: number;
  }[];
  ingredients: {
    id: number;
    name?: string;
    amount: string;
    isAlternative: boolean;
  }[];
  seasonings: {
    id: number;
    name?: string;
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
  duration: number; // API 요청 시 number 필요
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

// Recipe Ingredients API Types
export interface RecipeIngredientItem {
  id: number; // DB의 recipe_ingredient.id
  ingredientId: number; // 실제 재료 ID (food.id)
  name: string;
  amount: string;
  isAlternative: boolean;
}

export interface RecipeIngredientsResponse {
  recipeId: number;
  ingredients: RecipeIngredientItem[];
}

// Recipe Seasonings API Types
export interface RecipeSeasoningItem {
  id: number; // DB의 recipe_seasoning.id
  seasoningId: number; // 실제 양념 ID
  name: string;
  amount: string;
}

export interface RecipeSeasoningsResponse {
  recipeId: number;
  seasonings: RecipeSeasoningItem[];
}

// Recipe Tools API Types
export interface RecipeToolItem {
  id: number; // DB의 recipe_tool.id
  toolId: number; // 실제 조리도구 ID
  name: string;
}

export interface RecipeToolsResponse {
  recipeId: number;
  tools: RecipeToolItem[];
}
