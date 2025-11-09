import { use } from 'react';

import RecipeDetail from './_components/RecipeDetail';

import type { Metadata } from 'next';

interface RecipePageProps {
  params: Promise<{ id: number }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: '레시피 상세 정보를 확인하세요.',
    openGraph: {
      description: '레시피 상세 정보를 확인하세요.',
      title: '레시피 상세 | 한끼부터',
      type: 'website',
    },
    title: '레시피 상세 | 한끼부터',
  };
}

export default function RecipePage({ params }: RecipePageProps) {
  const { id } = use(params);
  return <RecipeDetail recipeId={id} />;
}
