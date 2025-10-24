import type { CompletedRecipe } from '@recipot/api';

export interface PageHeaderProps {
  title: string;
}

export type User = {
  profileImageUrl: string;
  nickname: string;
  email: string;
  platform: string;
  recipeCompleteCount: number;
};

export interface ProfileSectionProps {
  user: User;
}

export type PageType = 'recent' | 'saved' | 'cooked';

export interface RecipePageProps {
  params: Promise<{ type: PageType }>;
}

export interface Recipe {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  isBookmarked: boolean;
}

export interface CookedRecipe extends Recipe {
  cookedDate: string;
  reviewId: number | null;
}

export type configType = {
  overLayColor: string;
  themeColor: string;
  title: string;
  titleColor: string;
  noneBackImage: string;
};

export interface DefaultRecipeListProps {
  recipes: CompletedRecipe[];
  config: configType;
  onToggleSave: () => void;
  type: string;
}

export interface CookedRecipeListProps {
  recipes: CompletedRecipe[];
  config: configType;
  onToggleSave: () => void;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onToggleSave: (recipeId: number) => void;
}

export interface DietaryRestriction {
  id: number;
  name: string;
}
