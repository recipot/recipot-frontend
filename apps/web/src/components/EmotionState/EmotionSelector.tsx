import React from 'react';

import { EMOTION_OPTIONS } from './emotionConstants';
import EmotionOptionButton from './EmotionOptionButton';

import type { ReviewFeeling } from '../common/BottomSheet/types';

interface EmotionSelectorProps {
  selectedFeeling: ReviewFeeling | null;
  onFeelingSelect: (feeling: ReviewFeeling) => void;
}

function EmotionSelector({
  onFeelingSelect,
  selectedFeeling,
}: EmotionSelectorProps) {
  const isGoodSelected = selectedFeeling === 'good';
  const showContent = !isGoodSelected;

  return (
    <div className="xs:space-y-6 flex w-full flex-col items-center space-y-4 sm:space-y-8 md:space-y-10">
      {showContent && (
        <h2 className="xs:mt-5 xs:text-xl text-22 mt-3 text-center text-gray-900">
          식사는 어떠셨나요?
        </h2>
      )}
      {showContent && (
        <div className="xs:gap-2 flex w-full items-center justify-center gap-1 sm:gap-3 md:gap-4">
          {EMOTION_OPTIONS.review.map(({ color, feeling, label }) => (
            <EmotionOptionButton
              key={feeling}
              label={label}
              color={color}
              onClick={() => onFeelingSelect(feeling)}
              selected={selectedFeeling === feeling}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EmotionSelector;
