'use client';

import { useEffect } from 'react';
import { guestSession } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import StepIndicator from '@/app/onboarding/_components/StepIndicator';
import AllergyStep from '@/app/onboarding/_components/steps/AllergyStep';
import CookStateStep from '@/app/onboarding/_components/steps/CookStateStep';
import RefrigeratorStep from '@/app/onboarding/_components/steps/RefrigeratorStep';
import { STEP_CONFIG } from '@/app/onboarding/_constants';
import { onboardingStyles } from '@/app/onboarding/_utils';
import { Header } from '@/components/common/Header';
import { RefreshIcon } from '@/components/Icons';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useMoodStore } from '@/stores/moodStore';
import { useCurrentStep, useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

function OnboardingHeader() {
  const router = useRouter();
  const currentStep = useOnboardingStore(state => state.currentStep);
  const canGoToPreviousStep = useOnboardingStore(
    state => state.canGoToPreviousStep
  );
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const resetCurrentStep = useOnboardingStore(state => state.resetCurrentStep);
  const hasAllergySelection = useAllergiesStore(
    state => state.allergies.length > 0 || state.selectedItems.length > 0
  );
  const hasMoodSelection = useMoodStore(state => state.mood !== null);
  const hasFoodSelection = useSelectedFoodsStore(
    state => state.selectedFoodIds.length > 0
  );

  const handleBackClick = () => {
    if (canGoToPreviousStep()) {
      goToPreviousStep();
    } else {
      router.back();
    }
  };

  const handleRefreshClick = () => {
    resetCurrentStep();
  };

  const hasSelection =
    (currentStep === 1 && hasAllergySelection) ||
    (currentStep === 2 && hasMoodSelection) ||
    (currentStep === 3 && hasFoodSelection);

  const refreshIconColor = hasSelection ? 'hsl(var(--gray-900))' : undefined;

  return (
    <Header>
      <Header.Back show={currentStep > 1} onClick={handleBackClick} />
      <Header.Action onClick={handleRefreshClick} ariaLabel="새로고침">
        <RefreshIcon size={24} color={refreshIconColor} />
      </Header.Action>
    </Header>
  );
}

/**
 * 기존 온보딩 플로우를 재사용하는 컴포넌트
 * IntroStep 이후 기존 온보딩 UI(헤더, 스텝 인디케이터, 스텝 컴포넌트)를 그대로 렌더링합니다.
 */
export default function OnboardingFlow() {
  const { user } = useAuth();
  const currentStep = useCurrentStep();
  const currentStepData = STEP_CONFIG[currentStep - 1];

  // 비로그인 사용자일 때 게스트 세션 생성
  useEffect(() => {
    if (!user) {
      guestSession.getOrCreateSessionId().catch(error => {
        console.error('게스트 세션 생성 실패:', error);
      });
    }
  }, [user]);

  const renderCurrentStep = () => {
    switch (currentStep) {
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
      <OnboardingHeader />
      <Header.Spacer />
      <StepIndicator />

      <div className={onboardingStyles.stepHeader.wrapper}>
        <h2 className={onboardingStyles.stepHeader.title}>
          {currentStepData.title}
        </h2>
        <p className={onboardingStyles.stepHeader.description}>
          {currentStepData.description}
        </p>
      </div>

      <div>{renderCurrentStep()}</div>
    </>
  );
}
