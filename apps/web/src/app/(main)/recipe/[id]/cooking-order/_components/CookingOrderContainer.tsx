'use client';

import CookingOrderPresenter from './CookingOrderPresenter';

interface CookingOrderContainerProps {
  recipeId: string;
}

export default function CookingOrderContainer({
  recipeId,
}: CookingOrderContainerProps) {
  return <CookingOrderPresenter recipeId={recipeId} />;
}
