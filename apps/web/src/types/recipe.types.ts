export interface Recipe {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  cookware: string;
  image: string;
  description: string;
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
