export interface PageHeaderProps {
  title: string;
}

export interface User {
  avatarUrl: string;
  nickname: string;
  email: string;
}

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
  isSaved: boolean;
}

export interface CookedRecipe extends Recipe {
  cookedDate: string;
  reviewId: number | null;
}

type configType = {
  overLayColor: string;
  themeColor: string;
  title: string;
  titleColor: string;
};

export interface DefaultRecipeListProps {
  recipes: Recipe[];
  config: configType;
  type: string;
}

export interface CookedRecipeListProps {
  recipes: CookedRecipe[];
  config: configType;
}
