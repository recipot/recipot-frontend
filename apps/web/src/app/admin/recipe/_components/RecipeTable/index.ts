// Compound Components
import RecipeTableBody from '@/app/admin/recipe/_components/RecipeTable/compound/Body';
import RecipeTableHeader from '@/app/admin/recipe/_components/RecipeTable/compound/Header';
import RecipeTableRoot from '@/app/admin/recipe/_components/RecipeTable/compound/Root';

// Compound Component 구조
export const RecipeTable = Object.assign(RecipeTableRoot, {
  Body: RecipeTableBody,
  Header: RecipeTableHeader,
  Root: RecipeTableRoot,
});

// 기본 export (Root 컴포넌트)
export default RecipeTable;

