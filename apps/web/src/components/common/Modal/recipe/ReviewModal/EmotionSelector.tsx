import EmotionOptionButton from './EmotionOptionButton';

import type { ReviewFeeling } from './types';

interface EmotionSelectorProps {
  selectedFeeling: ReviewFeeling | null;
  onFeelingSelect: (feeling: ReviewFeeling) => void;
}

export function EmotionSelector({
  onFeelingSelect,
  selectedFeeling,
}: EmotionSelectorProps) {
  return (
    <div className="w-[342px] mb-6 gap-10 pt-5 px-6">
      {selectedFeeling === null ? (
        <p className="my-3 text-center text-[22px] font-semibold">
          식사는 어떠셨나요?
        </p>
      ) : (
        <div className="h-5" />
      )}
      <div className="flex w-full items-center justify-between gap-3">
        <EmotionOptionButton
          label="별로예요"
          color="blue"
          onClick={() => onFeelingSelect('bad')}
          selected={selectedFeeling === 'bad'}
        />
        <EmotionOptionButton
          label="그저 그래요"
          color="yellow"
          onClick={() => onFeelingSelect('soso')}
          selected={selectedFeeling === 'soso'}
        />
        <EmotionOptionButton
          label="또 해먹을래요"
          color="red"
          onClick={() => onFeelingSelect('good')}
          selected={selectedFeeling === 'good'}
        />
      </div>
    </div>
  );
}

export default EmotionSelector;
