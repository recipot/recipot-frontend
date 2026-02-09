'use client';

import { A_STEP_CONFIG } from '@/app/ab-test/_constants';
import { Header } from '@/components/common/Header';
import type { MoodType } from '@/components/EmotionState';
import EmotionSelector from '@/components/EmotionState/EmotionSelector';
import { useMoodStore } from '@/stores/moodStore';

import ABProgressBar from '../../ABProgressBar';
import ABPageLayout from './aPageLayout';

interface ConditionStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function ConditionStep({ onBack, onNext }: ConditionStepProps) {
  const mood = useMoodStore(state => state.mood);
  const setMood = useMoodStore(state => state.setMood);

  const stepConfig = A_STEP_CONFIG[0];

  const handleMoodSelect = (selectedMood: MoodType) => {
    setMood(selectedMood);
  };

  const handleNext = () => {
    if (mood) {
      onNext();
    }
  };

  return (
    <>
      <Header>
        <Header.Back onClick={onBack} />
      </Header>
      <Header.Spacer />
      <ABProgressBar currentStep={2} totalSteps={3} currentOnly />
      <ABPageLayout
        currentStep={2}
        title={stepConfig.title}
        question={stepConfig.question}
        buttonText="에너지는 이 정도에요"
        buttonDisabled={!mood}
        onButtonClick={handleNext}
        mood={mood}
      >
        <div className="flex items-center justify-center">
          <EmotionSelector
            selectedMood={mood}
            onMoodSelect={handleMoodSelect}
          />
        </div>
      </ABPageLayout>
    </>
  );
}
