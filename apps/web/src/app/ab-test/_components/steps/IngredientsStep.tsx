'use client';

import { useRef } from 'react';

import ABPageLayout from '@/app/ab-test/_components/ABPageLayout';
import { AB_STEP_CONFIG, MIN_SELECTED_FOODS } from '@/app/ab-test/_constants';
import type { IngredientsSearchRef } from '@/components/IngredientsSearch/IngredientsSearch';
import IngredientsSearch from '@/components/IngredientsSearch/IngredientsSearch';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

interface IngredientsStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

/**
 * A/B 테스트 B안 Step 2: 재료 검색
 * 기존 IngredientsSearch 컴포넌트를 재사용합니다.
 */
export default function IngredientsStep({
  onNext,
  onStepClick,
}: IngredientsStepProps) {
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
    <ABPageLayout
      currentStep={2}
      title={stepConfig.title}
      question={stepConfig.question}
      buttonText="다음으로"
      buttonDisabled={!hasEnoughFoods}
      onButtonClick={handleNext}
      mood={mood}
      onStepClick={onStepClick}
    >
      <div className="-mx-6">
        <IngredientsSearch ref={searchRef} variant="onboarding" />
      </div>
    </ABPageLayout>
  );
}
