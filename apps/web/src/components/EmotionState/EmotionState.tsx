import React, { useState } from 'react';

import { EMOTION_OPTIONS } from './emotionConstants';
import EmotionOptionButton from './EmotionOptionButton';

// 감정 관련 타입 정의
export type MoodType = 'bad' | 'neutral' | 'good';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

interface EmotionStateProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  className?: string;
}

const EmotionState: React.FC<EmotionStateProps> = ({
  className = '',
  initialMood = null,
  onMoodChange,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood
  );

  const handleMoodClick = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onMoodChange?.(newMood);
  };

  const getMoodState = (mood: MoodType): MoodState => {
    if (selectedMood === null) {
      return 'default'; // 아무것도 선택되지 않은 상태
    }
    return selectedMood === mood ? 'selected' : 'disabled'; // 선택된 상태와 비활성화된 상태
  };

  return (
    <div
      className={`xs:space-y-8 flex flex-col items-center space-y-6 sm:space-y-10 md:space-y-12 ${className}`}
    >
      <h2 className="xs:text-2xl mb-4 text-xl font-bold text-gray-800 sm:text-3xl md:text-4xl">
        감정 상태 컴포넌트
      </h2>

      {/* Default States Row */}
      <div className="xs:space-x-6 flex space-x-4 sm:space-x-8 md:space-x-10">
        {EMOTION_OPTIONS.mood.map(({ color, label, mood }) => {
          const moodState = getMoodState(mood);
          return (
            <EmotionOptionButton
              key={mood}
              label={label}
              color={color}
              selected={
                moodState === 'selected'
                  ? true
                  : moodState === 'disabled'
                    ? false
                    : undefined
              }
              onClick={() => handleMoodClick(mood)}
              variant="mood"
              enableAnimation
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmotionState;
