'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import {
  ABAllergyStep,
  ConditionStep,
  IngredientsStep,
  RecipeResultStep,
} from '@/app/ab-test/_components/steps';
import { useABTestStep } from '@/app/ab-test/_hooks';

/**
 * A/B 테스트 B안 메인 컴포넌트
 * 플로우: 못먹는음식(0) -> 컨디션(1) -> 재료입력(2) -> 결과(3)
 */
export default function ABTestVariantB() {
  const { currentStep, goToNextStep, goToStep } = useABTestStep();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <ABAllergyStep onNext={goToNextStep} />;
      case 1:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 2:
        return <IngredientsStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 3:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return <ABAllergyStep onNext={goToNextStep} />;
    }
  };

  return <div className="min-h-screen">{renderCurrentStep()}</div>;
}
