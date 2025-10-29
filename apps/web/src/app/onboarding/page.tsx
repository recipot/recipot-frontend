'use client';

import { useEffect } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { useCurrentStep } from '@/stores/onboardingStore';

import StepIndicator from './_components/StepIndicator';
import AllergyStep from './_components/steps/AllergyStep';
import CookStateStep from './_components/steps/CookStateStep';
import RefrigeratorStep from './_components/steps/RefrigeratorStep';
import { STEP_CONFIG } from './_constants';
import { onboardingStyles } from './_utils';

function OnboardingContent() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const currentStep = useCurrentStep();
  const currentStepData = STEP_CONFIG[currentStep - 1];

  // 온보딩 페이지 접근 제어
  useEffect(() => {
    if (loading) {
      return;
    }

    // 비로그인 사용자 → 로그인 페이지로 이동
    if (!user) {
      console.info('🔒 비로그인 사용자, 로그인 페이지로 이동');
      router.push('/signin');
      return;
    }

    // 이미 온보딩 완료한 사용자 → 레시피 추천 페이지로 이동
    if (!user.isFirstEntry) {
      console.info('✅ 이미 온보딩 완료, 레시피 추천 페이지로 이동');
      router.push('/recipeRecommend');
    }
  }, [loading, user, router]);

  // 로딩 중이거나 리다이렉트 대상인 경우 빈 화면 표시
  if (loading || !user?.isFirstEntry) {
    return null;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AllergyStep />;
      case 2:
        return <CookStateStep showImage={!user.isFirstEntry} />;
      case 3:
        return <RefrigeratorStep />;
      default:
        return <AllergyStep />;
    }
  };

  return (
    <>
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

export default function OnboardingPage() {
  return <OnboardingContent />;
}
