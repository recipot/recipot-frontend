import { useState } from 'react';

import { useAllergiesStore } from '@/stores/allergiesStore';
import { useMoodStore } from '@/stores/moodStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { onboardingStorage } from '../_utils/onboardingStorage';
import { useOnboardingActions } from './useOnboardingActions';

import type { OnboardingStepNumber } from '../_constants';
import type {
  Step1Data,
  Step2Data,
  Step3Data,
} from '../_utils/onboardingStorage';

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
   * 데이터 저장 및 다음 단계 진행
   * 각 도메인 스토어에서 데이터를 가져와 onboardingStorage에 저장
   */
  const saveAndProceed = async () => {
    try {
      setIsSubmitting(true);

      // 각 스텝별로 해당 도메인 스토어에서 데이터 가져와서 localStorage에 저장
      if (stepNumber === 1) {
        const { allergies, selectedItems } = useAllergiesStore.getState();
        onboardingStorage.saveStepData(1, {
          allergies,
          selectedItems,
        } as Omit<Step1Data, 'timestamp'>);
        console.info('✅ Step 1 완료:', { allergies, selectedItems });
      } else if (stepNumber === 2) {
        const { mood } = useMoodStore.getState();
        if (!mood) {
          throw new Error('기분이 선택되지 않았습니다.');
        }
        onboardingStorage.saveStepData(2, {
          mood,
        } as Omit<Step2Data, 'timestamp'>);
        console.info('✅ Step 2 완료:', { mood });
      } else if (stepNumber === 3) {
        const { selectedFoodIds } = useSelectedFoodsStore.getState();
        onboardingStorage.saveStepData(3, {
          selectedFoods: selectedFoodIds,
        } as Omit<Step3Data, 'timestamp'>);
        console.info('✅ Step 3 완료:', { selectedFoods: selectedFoodIds });
      } else {
        throw new Error(`지원하지 않는 스텝 번호: ${stepNumber}`);
      }

      // 온보딩 진행 상태 업데이트
      markStepCompleted(stepNumber);

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
