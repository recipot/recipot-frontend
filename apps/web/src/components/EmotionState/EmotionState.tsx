'use client';
import './styles.css';

import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { EMOTION_OPTIONS } from './emotionConstants';
import EmotionImage from './EmotionImage';
import EmotionOptionButton from './EmotionOptionButton';

import type { ShowImageProps } from '@recipot/types';

export type MoodType = 'bad' | 'neutral' | 'good' | 'default';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

interface EmotionStateProps extends ShowImageProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  className?: string;
  /**
   * 타이핑 완료 시 호출되는 콜백
   */
  onTypingComplete?: () => void;
}

/**
 * 사용자의 현재 기분을 선택할 수 있는 컴포넌트
 */
const EmotionState: React.FC<EmotionStateProps> = ({
  className = '',
  initialMood = null,
  onMoodChange,
  onTypingComplete,
  showImage,
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
    // 초기 상태일 때 기본 그래디언트 적용
    if (mood === null) {
      return 'emotion-gradient-default';
    }

    // 선택된 감정에 따른 그래디언트
    const gradientMap = {
      bad: 'emotion-gradient-bad',
      default: 'emotion-gradient-default',
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
        'flex w-full flex-col items-center overflow-hidden',
        className,
        getBackgroundGradient(selectedMood)
      )}
    >
      {/* 버튼 영역 - 고정 높이 */}
      <div className="flex h-[140px] w-full items-center justify-center pt-8">
        <div className="flex w-fit justify-between gap-[15.5px] px-10">
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

      {/* 캐릭터 영역 - flex-1로 나머지 공간 차지 */}
      {showImage && (
        <div className="flex w-full flex-1 items-center justify-center">
          <EmotionImage
            mood={selectedMood ?? 'default'}
            onTypingComplete={onTypingComplete}
          />
        </div>
      )}
    </div>
  );
};

export default EmotionState;
