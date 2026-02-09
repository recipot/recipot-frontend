'use client';

import { useRef } from 'react';

import { A_MIN_SELECTED_FOODS, A_STEP_CONFIG } from '@/app/ab-test/_constants';
import { Header } from '@/components/common/Header';
import type { IngredientsSearchRef } from '@/components/IngredientsSearch/IngredientsSearch';
import IngredientsSearch from '@/components/IngredientsSearch/IngredientsSearch';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import ABProgressBar from '../../ABProgressBar';
import ABPageLayout from './aPageLayout';

interface IngredientsStepProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function IngredientsStep({ onBack, onNext }: IngredientsStepProps) {
  const searchRef = useRef<IngredientsSearchRef>(null);
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  const stepConfig = A_STEP_CONFIG[1];

  const hasEnoughFoods = selectedFoodIds.length >= A_MIN_SELECTED_FOODS;

  const handleNext = () => {
    if (hasEnoughFoods) {
      onNext();
    }
  };

  return (
    <>
      <Header>
        <Header.Back onClick={onBack} />
      </Header>
      <Header.Spacer />
      <ABProgressBar currentStep={3} totalSteps={3} currentOnly />
      <ABPageLayout
        currentStep={3}
        title={stepConfig.title}
        question={stepConfig.question}
        buttonText="여유에 맞는 요리 추천받기"
        buttonDisabled={!hasEnoughFoods}
        onButtonClick={handleNext}
        mood={mood}
      >
        <IngredientsSearch ref={searchRef} variant="onboarding" />
      </ABPageLayout>
    </>
  );
}
