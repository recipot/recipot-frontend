import React, { useState } from 'react';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

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

  // 선택된 감정에 따른 배경색 그래디언트 클래스 반환 (Figma 디자인 기반)
  const getBackgroundGradient = (mood: MoodType | null): string => {
    switch (mood) {
      case 'bad':
        // 힘들어: 연한 파란색 그래디언트 (하단이 더 진함)
        return 'bg-gradient-to-b from-transparent via-[#d4e6ff1f] to-[#d4e0ffcc]';
      case 'neutral':
        // 그럭저럭: 연한 노란색 그래디언트 (하단이 더 진함)
        return 'bg-gradient-to-b from-transparent via-[#fff7c41f] to-[#fff7c4cc]';
      case 'good':
        // 충분해: 연한 분홍색 그래디언트 (하단이 더 진함)
        return 'bg-gradient-to-b from-transparent via-[#ffdbdc1f] to-[#ffdbdccc]';
      default:
        // 기본 상태: 연한 녹색 그래디언트 (하단이 더 진함)
        return 'bg-gradient-to-b from-transparent via-[#e8ffd01f] to-[#e8ffd0cc]';
    }
  };

  return (
    <div
      className={cn(
        'flex h-[95vh] flex-col items-center overflow-hidden',
        className,
        getBackgroundGradient(selectedMood)
      )}
    >
      {/* 메인 제목과 서브 텍스트 그룹 */}
      <div className="xs:mb-10 mb-8 text-center sm:mb-12 md:mb-16">
        <h1 className="text-24 xs:text-2xl font-semibold text-gray-900 sm:text-3xl md:text-4xl">
          요리할 여유가 얼마나 있나요?
        </h1>
        <p className="text-18 xs:mt-3 xs:text-lg mt-2 text-gray-600 sm:mt-4 sm:text-xl md:text-2xl">
          상태와 재료 딱 두 가지만 알려주세요!
        </p>
      </div>

      {/* Default States Row */}
      <div className="xs:space-x-6 flex space-x-4 sm:space-x-8 md:space-x-10">
        {EMOTION_OPTIONS.mood.map(({ color, label, mood }) => {
          return (
            <EmotionOptionButton
              key={mood}
              label={label}
              color={color}
              selected={
                selectedMood === null
                  ? undefined
                  : selectedMood === mood
                    ? true
                    : false
              }
              onClick={() => handleMoodClick(mood)}
              variant="mood"
              enableAnimation
            />
          );
        })}
      </div>

      {/* 감정 선택 시 요리 추천 버튼 - Figma 디자인에 맞게 하단 고정 */}
      {selectedMood && (
        <div className="fixed right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-white via-white/80 to-transparent px-6 pt-4 pb-8">
          <div className="mx-auto w-[238px]">
            <Button
              size="full"
              shape="round"
              className="bg-[#68982d] text-white hover:bg-[#5a7d26] active:bg-[#4a6b1f]"
              onClick={() => {
                // TODO: 요리 추천 페이지로 이동하는 로직 구현
                console.log('여유에 맞는 요리 추천받기 클릭됨', selectedMood);
              }}
            >
              여유에 맞는 요리 추천받기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionState;
