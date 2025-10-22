import { use } from 'react';

import type { RecipePageProps } from '@/types/MyPage.types';

import RecipeListPage from './_components/RecipeListPage';

export default function MyRecipePage({ params }: RecipePageProps) {
  const { type } = use(params);

  return <RecipeListPage type={type} />;
}
