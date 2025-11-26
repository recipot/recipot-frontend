'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ReviewBottomSheet } from '@/components/review/ReviewBottomSheet';
import { checkIsNaN } from '@/lib/checkIsNaN';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [completedRecipeId, setCompletedRecipeId] = useState<number | null>(
    null
  );

  const [recipeIdFromUrl, setRecipeIdFromUrl] = useState<number | null>(null);

  useEffect(() => {
    const completedIdParam = searchParams.get('completedRecipeId');
    const recipeIdParam = searchParams.get('recipeId');

    if (completedIdParam) {
      const parsedCompletedId = Number(completedIdParam);

      if (checkIsNaN(parsedCompletedId)) {
        setCompletedRecipeId(parsedCompletedId);
        setIsOpen(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }

    if (recipeIdParam) {
      const recipeId = Number(recipeIdParam);

      if (checkIsNaN(recipeId)) {
        setRecipeIdFromUrl(recipeId);
      }
    }
  }, [searchParams, router]);

  const handleClose = async () => {
    setIsOpen(false);

    if (recipeIdFromUrl) {
      router.push(`/recipe/${recipeIdFromUrl}/cooking-order?lastStep=true`);
    }
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
