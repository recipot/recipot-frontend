import React from 'react';

import { Button } from '@/components/common/Button/Button';
import type { useReviewForm } from '@/hooks/useReviewForm';

import { RecipeProsSelector } from '../RecipeProsSelector';

import EmotionSelector from './EmotionSelector';

interface ReviewFormProps {
  form: ReturnType<typeof useReviewForm>;
}

export function ReviewForm({ form }: ReviewFormProps) {
  const {
    canSubmit,
    feeling,
    handleFeelingClick,
    handleSubmit,
    pros,
    togglePro,
  } = form;

  return (
    <div className="mx-auto flex max-w-[292px] flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-[155px]">
            <EmotionSelector
              selectedFeeling={feeling}
              onFeelingSelect={handleFeelingClick}
            />

            {feeling === 'good' && (
              <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
            )}
          </div>

          <div className="fixed bottom-[30px] left-0 w-full px-6">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-[6.25rem] px-[2rem] py-[0.938rem]"
            >
              후기 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
