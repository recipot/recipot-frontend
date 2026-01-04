'use client';

import { useCallback, useState } from 'react';

import { TOTAL_STEPS } from '@/app/ab-test/_constants';

/**
 * A/B 테스트 B안 스텝 관리 훅
 * 로컬 상태로 관리하여 로그인 없이도 동작합니다.
 */
export function useABTestStep() {
  const [currentStep, setCurrentStep] = useState(1);

  /** 다음 스텝으로 이동 */
  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  /** 이전 스텝으로 이동 */
  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  /** 특정 스텝으로 이동 */
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  /** 이전 스텝으로 이동 가능 여부 */
  const canGoBack = currentStep > 1;

  /** 다음 스텝으로 이동 가능 여부 */
  const canGoNext = currentStep < TOTAL_STEPS;

  /** 마지막 스텝 여부 */
  const isLastStep = currentStep === TOTAL_STEPS;

  return {
    canGoBack,
    canGoNext,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLastStep,
  };
}
