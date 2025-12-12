'use client';

import { type ReactNode } from 'react';

interface RecipeModalsRootProps {
  children: ReactNode;
}

/**
 * RecipeModals.Root
 * 레시피 모달들의 최상위 컨테이너
 * Context는 상위에서 제공됨
 */
export default function RecipeModalsRoot({ children }: RecipeModalsRootProps) {
  return <>{children}</>;
}

