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

export interface Recipe {
  id: number;
  title: string;
  description: string;
  duration: string;
  condition: Condition;
  images: {
    id: number;
    imageUrl: string;
  }[];
  ingredients: IngredientsGroup;
  seasonings: Seasoning[];
  tools: Cookware[];
  steps: CookingStep[];
  healthPoints: HealthPoint[];
}

export interface RecipeDetailProps {
  recipe: Recipe;
}

export type TabId = 'ingredients' | 'cookware' | 'steps';
