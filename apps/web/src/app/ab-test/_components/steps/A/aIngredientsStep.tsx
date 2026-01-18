'use client';

import { useRef } from 'react';

import RecipeHeader from '@/app/(recipeRecommend)/recipeRecommend/_components/RecipeHeader';
import { A_MIN_SELECTED_FOODS, A_STEP_CONFIG } from '@/app/ab-test/_constants';
import type { IngredientsSearchRef } from '@/components/IngredientsSearch/IngredientsSearch';
import IngredientsSearch from '@/components/IngredientsSearch/IngredientsSearch';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import ABProgressBar from '../../ABProgressBar';
import ABPageLayout from './aPageLayout';

interface IngredientsStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export default function IngredientsStep({ onNext }: IngredientsStepProps) {
  const searchRef = useRef<IngredientsSearchRef>(null);
  const mood = useMoodStore(state => state.mood);
  const selectedFoodIds = useSelectedFoodsStore(state => state.selectedFoodIds);

  const stepConfig = A_STEP_CONFIG[1];

  // 선택된 재료가 있는지 확인
  const hasSelectedFoods = selectedFoodIds.length > 0;
  const hasEnoughFoods = selectedFoodIds.length >= A_MIN_SELECTED_FOODS;

  const handleNext = () => {
    if (hasEnoughFoods) {
      onNext();
    }
  };

  return (
    <>
      <RecipeHeader disabled={!hasSelectedFoods} />
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
