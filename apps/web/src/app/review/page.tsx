'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ReviewBottomSheet } from '@/components/review/ReviewBottomSheet';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [completedRecipeId, setCompletedRecipeId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const recipeId = searchParams.get('completedRecipeId');
    if (recipeId) {
      const id = Number(recipeId);
      if (!isNaN(id) && id > 0) {
        setCompletedRecipeId(id);
        setIsOpen(true);
      } else {
        // 유효하지 않은 recipeId인 경우 메인 페이지로 리다이렉트
        router.push('/');
      }
    } else {
      // completedRecipeId가 없는 경우 메인 페이지로 리다이렉트
      router.push('/');
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setIsOpen(false);
    // 후기 작성 완료 후 메인 페이지로 이동
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
