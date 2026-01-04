'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import {
  ConditionStep,
  IngredientsStep,
  RecipeResultStep,
} from '@/app/ab-test/_components/steps';
import { useABTestStep } from '@/app/ab-test/_hooks';

/**
 * A/B 테스트 B안 메인 컴포넌트
 */
export default function ABTestVariantB() {
  const { currentStep, goToNextStep, goToStep } = useABTestStep();

  // 현재 스텝에 따른 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 2:
        return <IngredientsStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 3:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
    }
  };

  return <div className="min-h-screen">{renderCurrentStep()}</div>;
}
