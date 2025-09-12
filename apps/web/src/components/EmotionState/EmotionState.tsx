import './styles.css';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { EMOTION_OPTIONS } from './emotionConstants';
import EmotionOptionButton from './EmotionOptionButton';

// ============================================================================
// 타입 정의
// ============================================================================

export type MoodType = 'bad' | 'neutral' | 'good';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

interface EmotionStateProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  className?: string;
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

/**
 * 사용자의 현재 기분을 선택할 수 있는 컴포넌트
 */
const EmotionState: React.FC<EmotionStateProps> = ({
  className = '',
  initialMood = null,
  onMoodChange,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood
  );

  // 기분 버튼 클릭 핸들러
  const handleMoodClick = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onMoodChange?.(newMood);
  };

  // 배경 그라디언트 클래스 반환
  const getBackgroundGradient = (mood: MoodType | null) => {
    // 초기 상태일 때만 랜덤 그래디언트 적용
    if (mood === null) {
      const gradients = [
        'emotion-gradient-bad',
        'emotion-gradient-good',
        'emotion-gradient-neutral',
      ];
      const randomIndex = Math.floor(Math.random() * gradients.length);
      return gradients[randomIndex];
    }

    // 선택된 감정에 따른 그래디언트
    const gradientMap = {
      bad: 'emotion-gradient-bad',
      good: 'emotion-gradient-good',
      neutral: 'emotion-gradient-neutral',
    };
    return gradientMap[mood];
  };

  // 버튼 선택 상태 결정
  const getButtonSelectedState = (mood: MoodType) => {
    if (selectedMood === null) return undefined;
    return selectedMood === mood;
  };

  return (
    <div
      className={cn(
        'flex h-[95vh] flex-col items-center overflow-hidden',
        className,
        getBackgroundGradient(selectedMood)
      )}
    >
      <div className="xs:space-x-6 flex space-x-4 sm:space-x-8 md:space-x-10">
        {EMOTION_OPTIONS.mood.map(({ color, label, mood }) => (
          <EmotionOptionButton
            key={mood}
            label={label}
            color={color}
            selected={getButtonSelectedState(mood)}
            onClick={() => handleMoodClick(mood)}
            variant="mood"
          />
        ))}
      </div>
    </div>
  );
};

export default EmotionState;
