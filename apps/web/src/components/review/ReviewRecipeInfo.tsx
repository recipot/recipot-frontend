import Image from 'next/image';

import type { ReviewData } from '@/types/review.types';

interface ReviewRecipeInfoProps {
  reviewData: ReviewData;
}

export function ReviewRecipeInfo({ reviewData }: ReviewRecipeInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {reviewData.recipeImageUrl ? (
          <Image
            src={reviewData.recipeImageUrl}
            alt={reviewData.recipeName}
            width={72}
            height={72}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <div className="h-7 w-7 rounded bg-gray-300" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-15 text-gray-600">
          {reviewData.completionCount}번째 레시피 해먹기 완료!
        </p>
        <h2 className="text-20 truncate text-gray-900">
          {reviewData.recipeName}
        </h2>
      </div>
    </div>
  );
}
