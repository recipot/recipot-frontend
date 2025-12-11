// Compound Components
import RecipeTableBody from './compound/Body';
import RecipeTableHeader from './compound/Header';
import RecipeTableRoot from './compound/Root';

// Compound Component 구조
export const RecipeTable = Object.assign(RecipeTableRoot, {
  Body: RecipeTableBody,
  Header: RecipeTableHeader,
  Root: RecipeTableRoot,
});

// 기본 export (Root 컴포넌트)
export default RecipeTable;

