'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import { RecipeResultStep } from '@/app/ab-test/_components/steps';
import { useABTestStep } from '@/app/ab-test/_hooks';

import ABAllergyStep from './steps/aAllergyStep';
import ConditionStep from './steps/aConditionStep';
import CookStateStep from './steps/aCookstatestep';
import ABIntroStep from './steps/aIntroStep';
import { IngredientsStep } from './steps';

/**
 * A/B 테스트 A안 메인 컴포넌트
 * 플로우: 인트로 슬라이드(0) -> 못먹는음식(1) -> 재료입력(2) -> 컨디션(3) -> 결과(4)
 */
export default function ABTestVariantA() {
  const { currentStep, goToNextStep, goToStep } = useABTestStep();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <ABIntroStep onNext={goToNextStep} />;
      case 1:
        return <ABAllergyStep onNext={goToNextStep} />;
      case 2:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 3:
        return <IngredientsStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 4:
        return <CookStateStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 5:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return;
    }
  };

  return <div className="min-h-screen">{renderCurrentStep()}</div>;
}
