// Compound Components
import RecipeModalsImage from '@/app/admin/recipe/_components/RecipeModals/compound/Image';
import RecipeModalsIngredients from '@/app/admin/recipe/_components/RecipeModals/compound/Ingredients';
import RecipeModalsRoot from '@/app/admin/recipe/_components/RecipeModals/compound/Root';
import RecipeModalsSeasonings from '@/app/admin/recipe/_components/RecipeModals/compound/Seasonings';

// Types
/**
 * ModalType 타입 정의
 * 레시피 편집 모달의 타입을 정의합니다.
 */
export type ModalType = 'ingredients' | 'seasonings' | 'image';

// Compound Component 구조
export const RecipeModals = Object.assign(RecipeModalsRoot, {
  Image: RecipeModalsImage,
  Ingredients: RecipeModalsIngredients,
  Root: RecipeModalsRoot,
  Seasonings: RecipeModalsSeasonings,
});

// 기본 export (Root 컴포넌트)
export default RecipeModals;
