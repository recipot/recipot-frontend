'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/common/Button';
import EmotionState, { type MoodType } from '@/components/EmotionState';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { useOnboardingActions, useOnboardingStep } from '../../_hooks';
import { getSubmitButtonText } from '../../_utils';

import type { CookStateStepData } from '../../_types';

export default function CookStateStep() {
  // 온보딩 스텝 로직
  const { handleError, isSubmitting, saveAndProceed } = useOnboardingStep(2);

  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[2]);
  const savedMood = stepData?.mood ?? null;

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(savedMood);

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed) {
      setSelectedMood(null);
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [isRefreshed, clearRefreshFlag]);

  const handleMoodChange = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  const handleNext = async () => {
    if (!selectedMood) return;

    try {
      const cookStateData: CookStateStepData = {
        mood: selectedMood,
      };

      await saveAndProceed(cookStateData);
    } catch (error) {
      handleError(error as Error);
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 -z-10 h-screen min-h-[500px]">
        <EmotionState
          key={selectedMood ?? 'null'} // selectedMood가 변경되면 컴포넌트 리마운트
          onMoodChange={handleMoodChange}
          initialMood={selectedMood}
          className="h-full"
        />
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          onClick={handleNext}
          disabled={selectedMood === null || isSubmitting}
        >
          {getSubmitButtonText(isSubmitting, 2)}
        </Button>
      </div>
    </>
  );
}
