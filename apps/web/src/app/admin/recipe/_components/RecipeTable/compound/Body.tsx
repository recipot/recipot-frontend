'use client';

import { RecipeRow } from '@/app/admin/recipe/_components/RecipeRow/RecipeRow';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { TableBody } from '@/components/ui/table';

/**
 * RecipeTable.Body
 * 레시피 테이블의 바디 컴포넌트
 * Context를 통해 recipes와 editedRecipes에 접근하여 RecipeRow 렌더링
 */
export default function RecipeTableBody() {
  const { editedRecipes, recipes } = useRecipeTableDataContext();

  return (
    <TableBody>
      {recipes.map(recipeItem => {
        const editedData = editedRecipes.get(recipeItem.id);
        return (
          <RecipeRow
            editedData={editedData}
            key={recipeItem.id}
            recipeItem={recipeItem}
          />
        );
      })}
    </TableBody>
  );
}
