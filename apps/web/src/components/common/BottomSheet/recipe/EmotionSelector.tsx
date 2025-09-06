import React from 'react';

import EmotionOptionButton from './EmotionOptionButton';

import type { ReviewFeeling } from '../types';

interface EmotionSelectorProps {
  selectedFeeling: ReviewFeeling | null;
  onFeelingSelect: (feeling: ReviewFeeling) => void;
}

function EmotionSelector({
  onFeelingSelect,
  selectedFeeling,
}: EmotionSelectorProps) {
  const showButtons = selectedFeeling !== 'good';
  const showTitle = selectedFeeling !== 'good';

  return (
    <div className="flex w-full flex-col items-center space-y-6">
      {showTitle && (
        <h2 className="text-22 mt-5 text-center text-gray-900">
          식사는 어떠셨나요?
        </h2>
      )}
      {showButtons && (
        <div className="flex w-full items-center justify-center gap-3">
          <EmotionOptionButton
            label="별로예요"
            color="blue"
            onClick={() => onFeelingSelect('bad')}
            selected={
              selectedFeeling === null ? undefined : selectedFeeling === 'bad'
            }
          />
          <EmotionOptionButton
            label="그저 그래요"
            color="yellow"
            onClick={() => onFeelingSelect('soso')}
            selected={
              selectedFeeling === null ? undefined : selectedFeeling === 'soso'
            }
          />
          <EmotionOptionButton
            label="또 해먹을래요"
            color="red"
            onClick={() => onFeelingSelect('good')}
            selected={selectedFeeling === null ? undefined : false}
          />
        </div>
      )}
    </div>
  );
}

export default EmotionSelector;
