import { CompletedRecipe } from '../../api/src/mypage.api';

// ============================================================================
// 사용자 관련 타입
// ============================================================================

export type User = {
  profileImageUrl: string;
  nickname: string;
  email: string;
  platform: string;
  recipeCompleteCount: number;
};

// ============================================================================
// 레시피 관련 타입
// ============================================================================

/**
 * 마이페이지에서 사용하는 간소화된 Recipe 타입
 * 상세 페이지의 Recipe와는 다른 형태
 *
 * Note: recipe.types.ts의 Recipe와 구별하기 위해 MyPageRecipe로 명명
 */
export interface MyPageRecipe {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  isBookmarked: boolean;
}

export interface CookedRecipe extends MyPageRecipe {
  cookedDate: string;
  reviewId: number | null;
}

// ============================================================================
// 페이지 설정 타입
// ============================================================================

export type PageType = 'recent' | 'saved' | 'cooked';

export type configType = {
  overLayColor: string;
  themeColor: string;
  title: string;
  titleColor: string;
  noneBackImage: string;
};

// ============================================================================
// 기타 도메인 타입
// ============================================================================

export interface DietaryRestriction {
  id: number;
  name: string;
}

// ============================================================================
// 컴포넌트 Props 타입
// ============================================================================

export interface PageHeaderProps {
  title: string;
}

export interface ProfileSectionProps {
  user: User;
}

export interface RecipePageProps {
  params: Promise<{ type: PageType }>;
}

export interface RecipeCardProps {
  recipe: MyPageRecipe;
  onToggleSave: (recipeId: number) => void;
}

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
