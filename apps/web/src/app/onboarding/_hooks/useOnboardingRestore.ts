import { useEffect, useState } from 'react';

import { onboardingStorage } from '../_utils/onboardingStorage';
import { useOnboardingActions } from './useOnboardingActions';

import type { RestoreDialogData } from '../_types';

/**
 * 온보딩 데이터 복구 로직 훅
 */
export function useOnboardingRestore() {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoreData, setRestoreData] = useState<RestoreDialogData | null>(
    null
  );

  const { markStepCompleted, setCurrentStep, setStepData } =
    useOnboardingActions();

  // 페이지 로드 시 복구 데이터 확인
  useEffect(() => {
    const checkRestoreData = () => {
      // 데이터 유효성 확인
      if (!onboardingStorage.isDataValid()) {
        console.info('📅 만료된 온보딩 데이터 정리');
        onboardingStorage.clearData();
        return;
      }

      const {
        completedSteps,
        currentStep: restoredStep,
        hasData,
      } = onboardingStorage.restoreProgress();

      if (hasData) {
        console.info('🔄 이전 온보딩 데이터 발견:', {
          allData: onboardingStorage.getAllData(),
          completedSteps,
          restoredStep,
        });

        setRestoreData({ completedSteps, restoredStep });
        setShowRestoreDialog(true);
      } else {
        console.info('🆕 새로운 온보딩 시작');
      }
    };

    checkRestoreData();
  }, []);

  /**
   * 복구 확인 처리
   */
  const handleRestoreConfirm = () => {
    if (!restoreData) return;

    const { completedSteps, restoredStep } = restoreData;

    try {
      // 현재 스텝 설정
      setCurrentStep(restoredStep);

      // 완료된 스텝들 복원
      completedSteps.forEach((step: number) => {
        markStepCompleted(step);
      });

      // 각 스텝 데이터 복원
      const step1Data = onboardingStorage.getStepData(1);
      const step2Data = onboardingStorage.getStepData(2);
      const step3Data = onboardingStorage.getStepData(3);

      if (step1Data) {
        setStepData(1, {
          allergies: step1Data.allergies,
          selectedItems: step1Data.allergies, // 기존 호환성
        });
      }
      if (step2Data) {
        setStepData(2, { mood: step2Data.mood });
      }
      if (step3Data) {
        setStepData(3, { selectedFoods: step3Data.selectedFoods });
      }

      console.info('✅ 온보딩 데이터 복구 완료', {
        step: restoredStep,
        step1Data,
        step2Data,
        step3Data,
      });
    } catch (error) {
      console.error('❌ 데이터 복구 실패:', error);
      onboardingStorage.clearData();
    }

    closeDialog();
  };

  /**
   * 복구 거부 처리
   */
  const handleRestoreCancel = () => {
    console.info('🗑️ 사용자가 데이터 복구를 거부함');
    onboardingStorage.clearData();
    closeDialog();
  };

  /**
   * 다이얼로그 닫기
   */
  const closeDialog = () => {
    setShowRestoreDialog(false);
    setRestoreData(null);
  };

  return {
    handleRestoreCancel,
    handleRestoreConfirm,
    showRestoreDialog,
  };
}
