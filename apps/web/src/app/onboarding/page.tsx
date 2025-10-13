'use client';

import { useCurrentStep } from '@/stores/onboardingStore';

import StepIndicator from './_components/StepIndicator';
import AllergyStep from './_components/steps/AllergyStep';
import CookStateStep from './_components/steps/CookStateStep';
import RefrigeratorStep from './_components/steps/RefrigeratorStep';
import { STEP_CONFIG } from './_constants';
import { useOnboardingRestore } from './_hooks';
import { onboardingStyles } from './_utils';

function OnboardingContent() {
  const currentStep = useCurrentStep();
  const currentStepData = STEP_CONFIG[currentStep - 1];

  // 데이터 복구 로직
  const { handleRestoreCancel, handleRestoreConfirm, showRestoreDialog } =
    useOnboardingRestore();

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
      {/* 데이터 복구 다이얼로그 */}
      {/* TODO: 추후 공통 모달로 변경 */}
      {showRestoreDialog && (
        <div className={onboardingStyles.dialog.overlay}>
          <div className={onboardingStyles.dialog.content}>
            <h3 className={onboardingStyles.dialog.title}>
              이전 온보딩 데이터 발견
            </h3>
            <p className={onboardingStyles.dialog.description}>
              이전에 진행하던 온보딩이 있습니다.
              <br />
              이어서 진행하시겠습니까?
            </p>
            <div className={onboardingStyles.dialog.buttonGroup}>
              <button
                onClick={handleRestoreCancel}
                className={onboardingStyles.dialog.cancelButton}
              >
                새로 시작
              </button>
              <button
                onClick={handleRestoreConfirm}
                className={onboardingStyles.dialog.confirmButton}
              >
                이어서 진행
              </button>
            </div>
          </div>
        </div>
      )}

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
