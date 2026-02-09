'use client';

import { useCallback, useState } from 'react';

import { TOTAL_STEPS } from '@/app/ab-test/_constants';

const STEP_STORAGE_KEY = 'ab-test-a-step';

function getPersistedStep(): number {
  if (typeof window === 'undefined') return 0;
  const stored = sessionStorage.getItem(STEP_STORAGE_KEY);
  if (stored === null) return 0;
  const parsed = Number(stored);
  return parsed >= 0 && parsed <= TOTAL_STEPS ? parsed : 0;
}

function persistStep(step: number) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STEP_STORAGE_KEY, String(step));
  }
}

/**
 * A/B 테스트 A안 스텝 관리 훅
 * sessionStorage로 상태를 유지하여 페이지 이탈 후 복귀 시에도 스텝이 보존됩니다.
 */
export function useABTestStep() {
  const [currentStep, setCurrentStep] = useState(getPersistedStep);

  const updateStep = useCallback((updater: (prev: number) => number) => {
    setCurrentStep(prev => {
      const next = updater(prev);
      persistStep(next);
      return next;
    });
  }, []);

  /** 다음 스텝으로 이동 */
  const goToNextStep = useCallback(() => {
    updateStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, [updateStep]);

  /** 이전 스텝으로 이동 */
  const goToPreviousStep = useCallback(() => {
    updateStep(prev => Math.max(prev - 1, 0));
  }, [updateStep]);

  /** 특정 스텝으로 이동 */
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step <= TOTAL_STEPS) {
      updateStep(() => step);
    }
  }, [updateStep]);

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
