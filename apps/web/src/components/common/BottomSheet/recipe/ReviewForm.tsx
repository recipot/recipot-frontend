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
    <div className="xs:pb-6 flex w-full flex-col items-center">
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        <div
          className={`xs:space-y-6 space-y-4 ${feeling !== 'good' ? 'pb-[155px]' : ''}`}
        >
          <EmotionSelector
            selectedFeeling={feeling}
            onFeelingSelect={handleFeelingClick}
          />
          {feeling === 'good' && (
            <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
          )}
        </div>

        <div className="px-[30px] py-4">
          <Button
            type="submit"
            size="full"
            disabled={feeling === null}
            className="text-17sb h-[52px] w-full rounded-[6.25rem] px-[2rem] py-[15px] disabled:bg-gray-300 disabled:text-gray-500"
          >
            후기 등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
