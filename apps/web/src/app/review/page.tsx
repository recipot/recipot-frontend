'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { recipe } from '@recipot/api';

import { ReviewBottomSheet } from '@/components/review/ReviewBottomSheet';

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
      const id = Number(completedIdParam);
      if (!isNaN(id) && id > 0) {
        setCompletedRecipeId(id);
        setIsOpen(true);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }

    if (recipeIdParam) {
      const id = Number(recipeIdParam);
      if (!isNaN(id) && id > 0) {
        setRecipeIdFromUrl(id);
      }
    }
  }, [searchParams, router]);

  const handleClose = async (recipeId?: number) => {
    setIsOpen(false);

    // 1. ReviewBottomSheet에서 전달받은 recipeId 사용
    if (recipeId) {
      router.push(`/recipe/${recipeId}/cooking-order?lastStep=true`);
      return;
    }

    // 2. URL 쿼리 파라미터로 전달받은 recipeId 사용 (가장 확실한 방법)
    if (recipeIdFromUrl) {
      router.push(`/recipe/${recipeIdFromUrl}/cooking-order?lastStep=true`);
      return;
    }

    // 3. 둘 다 없는 경우 API로 조회 (Fallback)
    if (completedRecipeId) {
      try {
        const reviewData =
          await recipe.getCompletedRecipeDetail(completedRecipeId);
        if (reviewData?.recipeId) {
          router.push(
            `/recipe/${reviewData.recipeId}/cooking-order?lastStep=true`
          );
        } else {
          console.error('Recipe ID not found in review data');
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch recipe info:', error);
        router.push('/');
      }
    } else {
      router.push('/');
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
