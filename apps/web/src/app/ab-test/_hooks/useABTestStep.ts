'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { TOTAL_STEPS } from '@/app/ab-test/_constants';

/**
 * A/B 테스트 스텝 관리 훅
 *
 * 히스토리 전략:
 * - step 0: replaceState (히스토리 추가 X)
 * - step 1+: pushState (뒤로가기 가능)
 * - step 0에서 뒤로가기 → 이전 페이지
 */
export function useABTestStep() {
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant');

  const [currentStep, setCurrentStep] = useState(0);
  const isInitialized = useRef(false);

  const getUrl = useCallback(
    () => `/signin?variant=${variant}`,
    [variant]
  );

  useEffect(() => {
    if (isInitialized.current || !variant) return;
    isInitialized.current = true;

    window.history.replaceState({ step: 0, variant }, '', getUrl());
  }, [variant, getUrl]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const urlParams = new URLSearchParams(window.location.search);
      const currentVariant = urlParams.get('variant');

      if (!currentVariant || !window.location.pathname.endsWith('/signin')) {
        return;
      }

      setCurrentStep(event.state?.step ?? 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToNextStep = useCallback(() => {
    if (!variant || currentStep >= TOTAL_STEPS) return;

    const nextStep = currentStep + 1;
    window.history.pushState({ step: nextStep, variant }, '', getUrl());
    setCurrentStep(nextStep);
  }, [variant, currentStep, getUrl]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      window.history.back();
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (!variant || step < 0 || step > TOTAL_STEPS) return;

      window.history.replaceState({ step, variant }, '', getUrl());
      setCurrentStep(step);
    },
    [variant, getUrl]
  );

  return {
    canGoBack: currentStep > 0,
    canGoNext: currentStep < TOTAL_STEPS,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isLastStep: currentStep === TOTAL_STEPS,
  };
}
