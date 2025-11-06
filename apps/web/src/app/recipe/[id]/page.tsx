import { use } from 'react';

import RecipeDetail from './_components/RecipeDetail';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}
