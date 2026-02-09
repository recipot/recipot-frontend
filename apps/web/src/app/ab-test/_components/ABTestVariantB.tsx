'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import { useABTestStep } from '@/app/ab-test/_hooks';

import ABAllergyStep from './steps/A/aAllergyStep';
import ConditionStep from './steps/A/aConditionStep';
import IngredientsStep from './steps/A/aIngredientsStep';
import RecipeResultStep from './steps/A/aRecipeResultStep';
import { IntroStep } from './steps';

/**
 * A/B 테스트 B안 메인 컴포넌트
 * 플로우: 인트로(Lottie)(0) -> 못먹는음식(1) -> 컨디션(2) -> 재료입력(3) -> 결과(4)
 * A안 컴포넌트를 재사용하여 Header + ABProgressBar step-by-step 방식 적용
 * /ab-test 내에서 전체 플로우 완료 (인증 API 호출 없음)
 */
export default function ABTestVariantB() {
  const { currentStep, goToNextStep, goToPreviousStep, goToStep } =
    useABTestStep();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <IntroStep onNext={goToNextStep} />;
      case 1:
        return <ABAllergyStep onNext={goToNextStep} />;
      case 2:
        return <ConditionStep onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 3:
        return <IngredientsStep onNext={goToNextStep} onBack={goToPreviousStep} />;
      case 4:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return null;
    }
  };

  return <div className="min-h-screen">{renderCurrentStep()}</div>;
}
