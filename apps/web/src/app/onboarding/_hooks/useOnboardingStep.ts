import { useState } from 'react';

import { useOnboardingActions } from './useOnboardingActions';

import type { OnboardingStepNumber } from '../_constants';

/**
 * 온보딩 스텝 공통 로직 훅
 *
 * 주의: 데이터는 각 도메인 스토어에서 관리됩니다:
 * - allergiesStore: 알러지 데이터
 * - moodStore: 기분/컨디션 데이터
 * - selectedFoodsStore: 선택된 음식 데이터
 */
export function useOnboardingStep<T extends OnboardingStepNumber>(
  stepNumber: T
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { goToNextStep, markStepCompleted } = useOnboardingActions();

  /**
   * 다음 단계 진행
   */
  const saveAndProceed = async () => {
    try {
      setIsSubmitting(true);

      // 온보딩 진행 상태 업데이트
      markStepCompleted(stepNumber);

      // 다음 단계로 이동
      goToNextStep();
    } catch (error) {
      console.error(`❌ Step ${stepNumber} 진행 실패:`, error);
      throw error; // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
    } finally {
      // 비동기 작업이므로 finally에서 false로 설정
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