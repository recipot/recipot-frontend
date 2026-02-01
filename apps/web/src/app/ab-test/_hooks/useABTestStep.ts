'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { TOTAL_STEPS } from '@/app/ab-test/_constants';

/**
 * A/B 테스트 B안 스텝 관리 훅
 * 로컬 상태로 관리하여 로그인 없이도 동작합니다.
 * 브라우저 뒤로 가기 시 variant 파라미터를 유지합니다.
 */
export function useABTestStep() {
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant');

  const [currentStep, setCurrentStep] = useState(0);

  // 브라우저 뒤로 가기 처리: variant 파라미터 유지
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // popstate 이벤트 발생 시 이전 step으로 이동하거나 step 0이면 variant 유지한 상태로 유지
      if (event.state?.step !== undefined) {
        setCurrentStep(event.state.step);
      } else {
        // 히스토리에 step 정보가 없으면 이전 step으로
        setCurrentStep(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /** 다음 스텝으로 이동 */
  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => {
      const nextStep = Math.min(prev + 1, TOTAL_STEPS);
      // 히스토리에 step 정보를 저장하여 뒤로 가기 시 사용
      const url = variant ? `/signin?variant=${variant}` : '/signin';
      window.history.pushState({ step: nextStep }, '', url);
      return nextStep;
    });
  }, [variant]);

  /** 이전 스텝으로 이동 */
  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => {
      const prevStep = Math.max(prev - 1, 0);
      const url = variant ? `/signin?variant=${variant}` : '/signin';
      window.history.replaceState({ step: prevStep }, '', url);
      return prevStep;
    });
  }, [variant]);

  /** 특정 스텝으로 이동 */
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step <= TOTAL_STEPS) {
        const url = variant ? `/signin?variant=${variant}` : '/signin';
        window.history.replaceState({ step }, '', url);
        setCurrentStep(step);
      }
    },
    [variant]
  );

  /** 이전 스텝으로 이동 가능 여부 */
  const canGoBack = currentStep > 0;

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
