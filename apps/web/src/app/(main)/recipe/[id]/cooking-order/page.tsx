'use client';

import { useParams } from 'next/navigation';

import CookingOrderContainer from './_components/CookingOrderContainer';

export default function CookingOrderPage() {
  const params = useParams();
  const recipeId = params.id as string;

  return <CookingOrderContainer recipeId={recipeId} />;
}
