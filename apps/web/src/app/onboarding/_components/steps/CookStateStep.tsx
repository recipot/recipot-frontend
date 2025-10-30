'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import {
  EmotionBackground,
  EmotionSelector,
  type MoodType,
} from '@/components/EmotionState';
import { useMoodStore } from '@/stores/moodStore';

import { useOnboardingActions, useOnboardingStep } from '../../_hooks';
import { getSubmitButtonText } from '../../_utils';

export default function CookStateStep() {
  // 온보딩 스텝 로직
  const { handleError, isSubmitting, saveAndProceed } = useOnboardingStep(2);

  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // 저장된 데이터 불러오기 (moodStore에서)
  const savedMood = useMoodStore(state => state.mood);
  const setMood = useMoodStore(state => state.setMood);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(savedMood);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed) {
      setSelectedMood(null);
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [isRefreshed, clearRefreshFlag]);

  const handleMoodSelect = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
  };

  const handleNext = async () => {
    if (!selectedMood) return;

    try {
      // 기분 스토어에 저장
      setMood(selectedMood);

      await saveAndProceed();
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* 배경 - 전체 화면 고정 */}
      <EmotionBackground mood={selectedMood} className="fixed inset-0 -z-10" />

      {/* 기분 선택 버튼 영역 - 화면 중앙 */}
      <div className="flex h-[calc(100vh-20rem)] items-center justify-center">
        <EmotionSelector
          selectedMood={selectedMood}
          onMoodSelect={handleMoodSelect}
        />
      </div>

      {/* 버튼 영역 - 하단 고정 */}
      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          onClick={handleNext}
          disabled={selectedMood === null || isSubmitting}
        >
          {getSubmitButtonText(isSubmitting, 2)}
        </Button>
      </div>
    </div>
  );
}
