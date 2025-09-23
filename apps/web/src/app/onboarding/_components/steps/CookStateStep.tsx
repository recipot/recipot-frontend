'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import EmotionState, { type MoodType } from '@/components/EmotionState';
import { useSubmitMood } from '@/hooks';

import { useOnboarding } from '../../_context/OnboardingContext';

export default function CookStateStep() {
  const { goToNextStep, markStepCompleted, setStepData } = useOnboarding();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  // 기분 상태 전송 mutation
  const { isPending: isSubmitting, mutate: submitMood } = useSubmitMood();

  const handleMoodChange = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  const handleNext = () => {
    if (!selectedMood) return;

    // 기분 상태를 서버에 전송
    submitMood(selectedMood, {
      onSuccess: () => {
        const cookStateData = {
          mood: selectedMood,
        };
        setStepData(2, cookStateData);
        markStepCompleted(2);
        goToNextStep();
      },
    });
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 -z-10 h-screen min-h-[500px]">
        <EmotionState
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
          {isSubmitting ? '전송 중...' : '여유에 맞는 요리 추천받기'}
        </Button>
      </div>
    </>
  );
}
