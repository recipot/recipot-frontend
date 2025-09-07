import React from 'react';

import { Button } from '@/components/common/Button/Button';
import type { useReviewForm } from '@/hooks/useReviewForm';

import EmotionSelector from '../../../EmotionState/EmotionSelector';
import { RecipeProsSelector } from './RecipeProsSelector';

interface ReviewFormProps {
  form: ReturnType<typeof useReviewForm>;
}

export function ReviewForm({ form }: ReviewFormProps) {
  const { feeling, handleFeelingClick, handleSubmit, pros, togglePro } = form;

  return (
    <div className="xs:px-4 xs:pb-6 mx-auto flex w-full max-w-[342px] flex-col items-center justify-center px-2 pb-2">
      <div className="flex w-full flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="xs:space-y-5 space-y-2">
            <EmotionSelector
              selectedFeeling={feeling}
              onFeelingSelect={handleFeelingClick}
            />
            {feeling === 'good' && (
              <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
            )}
          </div>
          <div className="xs:mt-8 xs:pt-4 sticky bottom-0 left-0 z-10 mt-2 w-full bg-white pt-2">
            <Button
              type="submit"
              disabled={feeling === null}
              className="xs:py-[0.938rem] xs:text-base w-full rounded-[6.25rem] px-[2rem] py-[0.75rem] text-sm font-semibold"
            >
              후기 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
