import { EMOTION_OPTIONS } from './emotionConstants';
import EmotionOptionButton from './EmotionOptionButton';

import type { MoodType } from './EmotionState';

interface EmotionSelectorProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

/**
 * 기분 선택 버튼 영역 컴포넌트
 * 3개의 기분 버튼(힘들어, 그럭저럭, 충분해)을 표시합니다.
 */
export default function EmotionSelector({
  onMoodSelect,
  selectedMood,
}: EmotionSelectorProps) {
  // 버튼 선택 상태 결정
  const getButtonSelectedState = (mood: MoodType) => {
    if (selectedMood === null) return undefined;
    return selectedMood === mood;
  };

  return (
    <div className="flex h-[140px] w-full items-center justify-center pt-8">
      <div className="flex w-fit justify-between gap-[15.5px] px-10">
        {EMOTION_OPTIONS.mood.map(({ color, label, mood }) => (
          <EmotionOptionButton
            key={mood}
            label={label}
            color={color}
            selected={getButtonSelectedState(mood)}
            onClick={() => onMoodSelect(mood)}
            variant="mood"
          />
        ))}
      </div>
    </div>
  );
}
