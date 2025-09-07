import React, { useState } from 'react';

import MoodButton, { type MoodState, type MoodType } from '../MoodButton';

interface EmotionStateProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  disabled?: boolean;
  className?: string;
}

const EmotionState: React.FC<EmotionStateProps> = ({
  className = '',
  disabled = false,
  initialMood = null,
  onMoodChange,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood
  );

  const handleMoodClick = (mood: MoodType) => {
    if (disabled) return;

    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onMoodChange?.(newMood);
  };

  const getMoodState = (mood: MoodType): MoodState => {
    if (disabled) return 'disabled';
    if (selectedMood === mood) return 'selected';
    return 'default';
  };

  return (
    <div className={`flex flex-col items-center space-y-8 ${className}`}>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        감정 상태 컴포넌트
      </h2>

      {/* Default States Row */}
      <div className="flex space-x-8">
        <MoodButton
          type="bad"
          state={getMoodState('bad')}
          onClick={() => handleMoodClick('bad')}
          disabled={disabled}
        />
        <MoodButton
          type="neutral"
          state={getMoodState('neutral')}
          onClick={() => handleMoodClick('neutral')}
          disabled={disabled}
        />
        <MoodButton
          type="good"
          state={getMoodState('good')}
          onClick={() => handleMoodClick('good')}
          disabled={disabled}
        />
      </div>

      {/* Selected States Row */}
      <div className="flex space-x-8">
        <MoodButton type="bad" state="selected" disabled />
        <MoodButton type="neutral" state="disabled" disabled />
        <MoodButton type="good" state="disabled" disabled />
      </div>

      {/* Disabled States Row */}
      <div className="flex space-x-8">
        <MoodButton type="bad" state="disabled" disabled />
        <MoodButton type="neutral" state="selected" disabled />
        <MoodButton type="good" state="selected" disabled />
      </div>
    </div>
  );
};

export default EmotionState;
