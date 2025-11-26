'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ReviewBottomSheet } from '@/components/review/ReviewBottomSheet';

const parsePositiveNumber = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const completedRecipeId = parsePositiveNumber(
    searchParams.get('completedRecipeId')
  );
  const recipeIdFromQuery = parsePositiveNumber(searchParams.get('recipeId'));

  useEffect(() => {
    if (!completedRecipeId) {
      router.push('/');
      return;
    }

    setIsOpen(true);
  }, [completedRecipeId, router]);

  const handleClose = async (recipeId?: number) => {
    setIsOpen(false);

    const targetRecipeId = recipeId ?? recipeIdFromQuery;

    if (targetRecipeId) {
      router.push(`/recipe/${targetRecipeId}/cooking-order?lastStep=true`);
      return;
    }

    router.push('/');
  };

  if (!completedRecipeId) {
    return null;
  }

  return (
    <ReviewBottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      recipeId={completedRecipeId}
    />
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={null}>
      <ReviewContent />
    </Suspense>
  );
}
