import React, { useState } from 'react';

import { Button } from '@/components/common/Button/Button';

import { RecipeProsSelector } from '../RecipeProsSelector';

import EmotionSelector from './EmotionSelector';

import type { ReviewFeeling } from './types';

interface ReviewFormProps {
  timesCooked: number;
  onReviewSubmit: () => void;
}

export function ReviewForm({ onReviewSubmit, timesCooked }: ReviewFormProps) {
  const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
  const [pros, setPros] = useState<string[]>([]);

  const togglePro = (text: string) => {
    setPros(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const handleFeelingClick = (selectedFeeling: ReviewFeeling) => {
    setFeeling(prevFeeling =>
      prevFeeling === selectedFeeling ? null : selectedFeeling
    );
  };

  const canSubmit = !!feeling && (feeling !== 'good' || pros.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 서버에 제출할 데이터 구조
    const reviewData = {
      feeling,
      pros,
      timesCooked,
      // 기타 필요한 데이터 추가
    };

    console.log(reviewData, 'reviewData');

    onReviewSubmit(); // 부모 컴포넌트에 제출 완료 알림
  };

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
