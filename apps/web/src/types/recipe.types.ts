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
  selectedIngredients: string[];
  message: string;
}

export interface RecipeLikeResponse {
  recipeId: number;
  liked: boolean;
  message: string;
}
