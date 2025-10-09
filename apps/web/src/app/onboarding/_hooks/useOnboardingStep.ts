import { useState } from 'react';

import { onboardingStorage } from '../_utils/onboardingStorage';
import { useOnboardingActions } from './useOnboardingActions';

import type { OnboardingStepNumber } from '../_constants';
import type { OnboardingStepDataMap } from '../_types';
import type {
  Step1Data,
  Step2Data,
  Step3Data,
} from '../_utils/onboardingStorage';

/**
 * 온보딩 스텝 공통 로직 훅
 */
export function useOnboardingStep<T extends OnboardingStepNumber>(
  stepNumber: T
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { goToNextStep, markStepCompleted, setStepData } =
    useOnboardingActions();

  /**
   * 데이터 저장 및 다음 단계 진행
   */
  const saveAndProceed = async (data: OnboardingStepDataMap[T]) => {
    try {
      setIsSubmitting(true);
      // localStorage에 데이터 저장
      // 타입 안전성을 위한 조건부 호출
      if (stepNumber === 1) {
        onboardingStorage.saveStepData(1, data as Omit<Step1Data, 'timestamp'>);
      } else if (stepNumber === 2) {
        onboardingStorage.saveStepData(2, data as Omit<Step2Data, 'timestamp'>);
      } else if (stepNumber === 3) {
        onboardingStorage.saveStepData(3, data as Omit<Step3Data, 'timestamp'>);
      } else {
        throw new Error(`지원하지 않는 스텝 번호: ${stepNumber}`);
      }

      // 스토어 업데이트 (UI 상태 관리용)
      setStepData(stepNumber, data);
      markStepCompleted(stepNumber);

      console.info(`✅ Step ${stepNumber} 완료:`, data);

      // 다음 단계로 이동
      goToNextStep();
    } catch (error) {
      console.error(`❌ Step ${stepNumber} 데이터 저장 실패:`, error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 에러 처리 (향후 토스트 메시지 등으로 확장 가능)
   */
  const handleError = (error: Error) => {
    console.error(`Step ${stepNumber} 오류:`, error);
    // TODO: 에러 토스트 메시지 표시
  };

  return {
    handleError,
    isSubmitting,
    saveAndProceed,
  };
}
