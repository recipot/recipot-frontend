'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import EmotionState, { type MoodType } from '@/components/EmotionState';

import { useOnboarding } from '../../_context/OnboardingContext';

export default function CookStateStep() {
  const { goToNextStep, markStepCompleted, setStepData } = useOnboarding();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleMoodChange = (mood: MoodType | null) => {
    setSelectedMood(mood);
  };

  const handleNext = () => {
    const cookStateData = {
      mood: selectedMood,
    };
    setStepData(2, cookStateData);
    markStepCompleted(2);
    goToNextStep();
  };

  return (
    <>
      <EmotionState
        onMoodChange={handleMoodChange}
        initialMood={selectedMood}
        className="!h-[80vh] pb-[72px]"
      />

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button onClick={handleNext} disabled={selectedMood === null}>
          여유에 맞는 요리 추천받기
        </Button>
      </div>
    </>
  );
}
