'use client';

import { useEffect } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useMoodStore } from '@/stores/moodStore';
import { useCurrentStep, useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import StepIndicator from './_components/StepIndicator';
import AllergyStep from './_components/steps/AllergyStep';
import CookStateStep from './_components/steps/CookStateStep';
import RefrigeratorStep from './_components/steps/RefrigeratorStep';
import { STEP_CONFIG } from './_constants';
import { useOnboardingRestore } from './_hooks';
import { onboardingStyles } from './_utils';

function OnboardingContent() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const currentStep = useCurrentStep();
  const currentStepData = STEP_CONFIG[currentStep - 1];

  // 모든 스토어의 세션 검증 함수
  const validateOnboardingSession = useOnboardingStore(
    state => state.validateUserSession
  );
  const validateAllergiesSession = useAllergiesStore(
    state => state.validateUserSession
  );
  const validateMoodSession = useMoodStore(
    state => state.validateUserSession
  );
  const validateFoodsSession = useSelectedFoodsStore(
    state => state.validateUserSession
  );

  // 사용자 세션 검증 (사용자가 변경되면 모든 온보딩 데이터 초기화)
  useEffect(() => {
    if (!loading && user) {
      // user.id가 있다면 사용하고, 없으면 user 객체를 문자열로 변환하여 사용
      const userId = user.id?.toString() ?? JSON.stringify(user);

      // 모든 스토어의 세션 검증
      validateOnboardingSession(userId);
      validateAllergiesSession(userId);
      validateMoodSession(userId);
      validateFoodsSession(userId);
    }
  }, [
    user,
    loading,
    validateOnboardingSession,
    validateAllergiesSession,
    validateMoodSession,
    validateFoodsSession,
  ]);

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

  // 데이터 복구 로직
  const { handleRestoreCancel, handleRestoreConfirm, showRestoreDialog } =
    useOnboardingRestore();

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
      {/* 데이터 복구 다이얼로그 */}
      <ConfirmDialog
        open={showRestoreDialog}
        onOpenChange={() => {}}
        title="이전 온보딩 데이터 발견"
        description={
          <>
            이전에 진행하던 온보딩이 있습니다.
            <br />
            이어서 진행하시겠습니까?
          </>
        }
        cancelText="새로 시작"
        confirmText="이어서 진행"
        onCancel={handleRestoreCancel}
        onConfirm={handleRestoreConfirm}
        disableOverlayClick
      />

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
