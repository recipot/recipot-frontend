import React from 'react';

import { Button } from '@/components/common/Button/Button';
import type { useReviewForm } from '@/hooks/useReviewForm';

import EmotionSelector from '../../../BottomSheet/recipe/EmotionSelector';
import { RecipeProsSelector } from '../../../BottomSheet/recipe/RecipeProsSelector';

interface ReviewFormProps {
  form: ReturnType<typeof useReviewForm>;
}

export function ReviewForm({ form }: ReviewFormProps) {
  const { feeling, handleFeelingClick, handleSubmit, pros, togglePro } = form;

  return (
    <div className="mx-auto flex w-full max-w-[342px] flex-col items-center justify-center px-4 pb-6">
      <div className="flex w-full flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-5">
            <EmotionSelector
              selectedFeeling={feeling}
              onFeelingSelect={handleFeelingClick}
            />
            {feeling === 'good' && (
              <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
            )}
          </div>
          <div className="sticky bottom-0 left-0 z-10 mt-8 w-full bg-white pt-4">
            <Button
              type="submit"
              className="w-full rounded-[6.25rem] px-[2rem] py-[0.938rem] text-base font-semibold"
            >
              후기 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
