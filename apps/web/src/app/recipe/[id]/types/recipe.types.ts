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
  description: string;
  orderNum: number;
  step: number;
  summary: string;
}

export interface HealthPoint {
  content: string;
}

export interface Condition {
  id: number;
  name: string;
}

export interface RecipeCard {
  id: string;
  title: string;
  time: string;
  image: string;
}

export interface IngredientsGroup {
  owned: Ingredient[];
  notOwned: Ingredient[];
  alternativeUnavailable: Ingredient[];
}

export interface RecipeDetailProps {
  recipe: Recipe;
}

export type TabId = 'ingredients' | 'cookware' | 'steps';

export interface ApiResponse {
  success: boolean;
  data: Recipe;
  message: string;
}

export interface Recipe {
  description: string;
  duration: string;
  healthPoints?: HealthPoint[];
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

export interface PendingReviewsResponse {
  data: {
    completedRecipeIds: number[];
    totalCount: number;
  };
}

export interface RecipeIngredients {
  owned?: RecipeIngredient[];
  notOwned?: RecipeIngredient[];
  alternativeUnavailable?: RecipeIngredient[];
}

export interface RecipeRecommendResponse {
  recipes: Recipe[];
  message: string;
}

export interface Condition {
  id: number;
  name: string;
}

export interface ConditionsResponse {
  status: number;
  data: {
    conditions: Condition[];
  };
}

export interface RecommendationItem {
  recipeId: number;
  title: string;
  description: string;
  imageUrls: string[];
  duration: string;
  tools: Cookware[] | string[];
  isBookmarked: boolean;
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

export interface RecipeIngredient {
  amount: string;
  id: number;
  isAlternative: boolean;
  name: string;
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
