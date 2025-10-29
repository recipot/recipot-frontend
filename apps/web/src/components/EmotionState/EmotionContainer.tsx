'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import EmotionCharacter from './EmotionCharacter/EmotionCharacter';
import EmotionBackground from './EmotionBackground';
import EmotionSelector from './EmotionSelector';

import type { MoodType } from './EmotionState';
import type { ShowImageProps } from '@recipot/types';

export interface EmotionContainerProps extends ShowImageProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  className?: string;
  onTypingComplete?: () => void;
}

/**
 * 감정 상태 전체 컨테이너 컴포넌트
 * 배경, 선택 버튼, 캐릭터를 조합하여 표시합니다.
 */
export default function EmotionContainer({
  className = '',
  initialMood = null,
  onMoodChange,
  onTypingComplete,
  showImage,
}: EmotionContainerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood
  );

  // 기분 버튼 클릭 핸들러
  const handleMoodSelect = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onMoodChange?.(newMood);
  };

  return (
    <EmotionBackground
      mood={selectedMood}
      className={cn('flex flex-col items-center overflow-hidden', className)}
    >
      {/* 버튼 영역 - 고정 높이 */}
      <EmotionSelector
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelect}
      />

      {/* 캐릭터 영역 - flex-1로 나머지 공간 차지 */}
      {showImage && (
        <div className="flex w-full flex-1 items-center justify-center">
          <EmotionCharacter
            mood={selectedMood ?? 'default'}
            onTypingComplete={onTypingComplete}
          />
        </div>
      )}
    </EmotionBackground>
  );
}
