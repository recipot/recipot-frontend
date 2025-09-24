export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  status: 'owned' | 'substitutable' | 'required';
  substitutes?: string;
}

export interface Seasoning {
  name: string;
  amount: string;
}

export interface Cookware {
  name: string;
}

export interface CookingStep {
  step: number;
  description: string;
}

export interface RecipeCard {
  id: string;
  title: string;
  time: string;
  image: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  time: string;
  difficulty: string;
  description: string;
  ingredients: Ingredient[];
  seasonings: Seasoning[];
  cookware: Cookware[];
  steps: CookingStep[];
  relatedRecipes: RecipeCard[];
}

export interface RecipeDetailProps {
  recipe: Recipe;
}

export type TabId = 'ingredients' | 'cookware' | 'steps';
