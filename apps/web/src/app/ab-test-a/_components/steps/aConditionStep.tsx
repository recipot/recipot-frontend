'use client';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import { Header } from '@/components/common/Header';
import type { MoodType } from '@/components/EmotionState';
import EmotionSelector from '@/components/EmotionState/EmotionSelector';
import { useMoodStore } from '@/stores/moodStore';

import { AB_STEP_CONFIG } from '../../_constants';
import ABPageLayout from '../ABPageLayout';
import ABProgressBar from '../ABProgressBar';

interface ConditionStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export default function ConditionStep({ onNext }: ConditionStepProps) {
  const mood = useMoodStore(state => state.mood);
  const setMood = useMoodStore(state => state.setMood);

  const stepConfig = AB_STEP_CONFIG[0];

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
      <RecipeHeader disabled />
      <Header.Spacer />
      <ABProgressBar currentStep={2} totalSteps={3} />
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
