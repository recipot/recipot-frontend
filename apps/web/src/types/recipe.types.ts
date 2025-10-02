export interface RecipeIngredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
  category?: string;
  status?: 'owned' | 'substitutable' | 'unavailable'; // 보유, 대체가능, 대체불가
  alternatives?: string[]; // 대체 가능한 재료 목록
}

export interface CookingStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  estimatedTime?: number;
  tips?: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  cookingTime: number; // minutes
  ingredients: RecipeIngredient[];
  cookingSteps: CookingStep[];
}
