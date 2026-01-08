'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import {
  ABAllergyStep,
  ConditionStep,
  IngredientsStep,
  IntroStep,
  RecipeResultStep,
} from '@/app/ab-test/_components/steps';
import { useABTestStep } from '@/app/ab-test/_hooks';

/**
 * A/B 테스트 B안 메인 컴포넌트
 * 플로우: 인트로(0) -> 못먹는음식(1) -> 컨디션(2) -> 재료입력(3) -> 결과(4)
 * 비로그인 유저는 항상 인트로(A화면)부터 시작합니다.
 */
export default function ABTestVariantB() {
  const { currentStep, goToNextStep, goToStep } = useABTestStep();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroStep onNext={goToNextStep} />;
      case 1:
        return <ABAllergyStep onNext={goToNextStep} />;
      case 2:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 3:
        return <IngredientsStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 4:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return <IntroStep onNext={goToNextStep} />;
    }
  };

  return <div className="min-h-screen">{renderCurrentStep()}</div>;
}
