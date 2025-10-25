export interface Recipe {
  description: string;
  duration: number;
  healthPoints: {
    content: string;
  }[];
  images: {
    id: number;
    imageUrl: string;
  }[];
  id: number;
  title: string;
  tools: {
    id: number;
    imageUrl: string;
    name: string;
  }[];
  seasonings: {
    amount: string;
    id: number;
    name: string;
  }[];
  isBookmarked: boolean;
  ingredients: RecipeIngredients;
  steps: {
    orderNum: number;
    summary: string;
  }[];
}

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
  tools: string[];
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
