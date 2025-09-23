'use client';

import StepIndicator from './_components/StepIndicator';
import AllergyStep from './_components/steps/AllergyStep';
import CookStateStep from './_components/steps/CookStateStep';
import RefrigeratorStep from './_components/steps/RefrigeratorStep';
import { useOnboarding } from './_context/OnboardingContext';

const steps = [
  {
    description: '제외하고 추천해드릴게요!',
    id: 1,
    title: '못먹는 음식을 알려주세요',
  },
  {
    description: '상태와 재료 딱 두 가지만 알려주세요!',
    id: 2,
    title: '요리할 여유가 얼마나 있나요?',
  },
  {
    description: '두 가지만 골라도 요리를 찾아드려요',
    id: 3,
    title: '현재 냉장고에 어떤 재료를 \n가지고 계신가요?',
  },
];

function OnboardingContent() {
  const { state } = useOnboarding();
  const currentStepData = steps[state.currentStep - 1];

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 1:
        return <AllergyStep />;
      case 2:
        return <CookStateStep />;
      case 3:
        return <RefrigeratorStep />;
      default:
        return <AllergyStep />;
    }
  };

  return (
    <>
      <StepIndicator />

      <div className="mt-10 mb-4 text-center">
        <h2 className="text-24 mb-1 whitespace-pre-line">
          {currentStepData.title}
        </h2>
        <p className="text-18 text-gray-600">{currentStepData.description}</p>
      </div>

      <div>{renderCurrentStep()}</div>
    </>
  );
}

export default function OnboardingPage() {
  return <OnboardingContent />;
}
