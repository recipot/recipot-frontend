// Compound Components
import RecipeModalsImage from '@/app/admin/recipe/_components/RecipeModals/compound/Image';
import RecipeModalsIngredients from '@/app/admin/recipe/_components/RecipeModals/compound/Ingredients';
import RecipeModalsRoot from '@/app/admin/recipe/_components/RecipeModals/compound/Root';
import RecipeModalsSeasonings from '@/app/admin/recipe/_components/RecipeModals/compound/Seasonings';
// TODO: Steps 기능은 기획팀과 회의 중이므로 임시 주석처리
// import RecipeModalsSteps from '@/app/admin/recipe/_components/RecipeModals/compound/Steps';

// Types
/**
 * ModalType 타입 정의
 * 레시피 편집 모달의 타입을 정의합니다.
 */
export type ModalType = 'ingredients' | 'seasonings' | 'steps' | 'image';

// Compound Component 구조
export const RecipeModals = Object.assign(RecipeModalsRoot, {
  Image: RecipeModalsImage,
  Ingredients: RecipeModalsIngredients,
  Root: RecipeModalsRoot,
  Seasonings: RecipeModalsSeasonings,
  // TODO: Steps 기능은 기획팀과 회의 중이므로 임시 주석처리
  // Steps: RecipeModalsSteps,
});

// 기본 export (Root 컴포넌트)
export default RecipeModals;
