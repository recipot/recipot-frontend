'use client';

import { useRef } from 'react';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import { AB_STEP_CONFIG, MIN_SELECTED_FOODS } from '@/app/ab-test-a/_constants';
import { Header } from '@/components/common/Header';
import type { IngredientsSearchRef } from '@/components/IngredientsSearch/IngredientsSearch';
import IngredientsSearch from '@/components/IngredientsSearch/IngredientsSearch';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import ABPageLayout from '../ABPageLayout';
import ABProgressBar from '../ABProgressBar';

interface IngredientsStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export default function IngredientsStep({ onNext }: IngredientsStepProps) {
  const searchRef = useRef<IngredientsSearchRef>(null);
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  const stepConfig = AB_STEP_CONFIG[1];
  const hasEnoughFoods = selectedFoodIds.length >= MIN_SELECTED_FOODS;

  const handleNext = () => {
    if (hasEnoughFoods) {
      onNext();
    }
  };

  return (
    <>
      <RecipeHeader disabled />
      <Header.Spacer />
      <ABProgressBar currentStep={3} totalSteps={3} />
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
