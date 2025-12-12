'use client';

import { useRecipeTableActionsContext } from '@/app/admin/recipe/_components/RecipeTableActionsContext';
import { useRecipeTableDataContext } from '@/app/admin/recipe/_components/RecipeTableDataContext';
import { Checkbox } from '@/components/ui/checkbox';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * RecipeTable.Header
 * 레시피 테이블의 헤더 컴포넌트
 * Context를 통해 전체 선택 기능 제공
 */
export default function RecipeTableHeader() {
  const { recipes, selectedIds } = useRecipeTableDataContext();
  const { onSelectOne } = useRecipeTableActionsContext();
  const isAllSelected =
    recipes.length > 0 && selectedIds.size === recipes.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      recipes.forEach(recipe => {
        onSelectOne(recipe.id, true);
      });
    } else {
      recipes.forEach(recipe => {
        onSelectOne(recipe.id, false);
      });
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
        </TableHead>
        <TableHead>ID</TableHead>
        <TableHead>레시피 타이틀</TableHead>
        <TableHead>대표 이미지</TableHead>
        <TableHead>조리시간</TableHead>
        <TableHead>유저 컨디션</TableHead>
        <TableHead>후킹 타이틀</TableHead>
        <TableHead>조리도구</TableHead>
        <TableHead>재료</TableHead>
        <TableHead>대체불가능 재료</TableHead>
        <TableHead>양념</TableHead>
        {/* TODO: Steps 기능은 기획팀과 회의 중이므로 임시 주석처리 */}
        {/* <TableHead>요리순서</TableHead> */}
      </TableRow>
    </TableHeader>
  );
}
