'use client';

import { type ReactNode } from 'react';

interface RecipeTableRootProps {
  children: ReactNode;
}

/**
 * RecipeTable.Root
 * 레시피 테이블의 최상위 컨테이너
 * Context는 상위에서 제공됨
 */
export default function RecipeTableRoot({ children }: RecipeTableRootProps) {
  return <>{children}</>;
}

