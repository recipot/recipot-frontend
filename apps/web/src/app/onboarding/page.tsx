'use client';

import { useEffect, useState } from 'react';

import { useCurrentStep, useOnboardingStore } from '@/stores/onboardingStore';
import { onboardingStorage } from '@/utils/onboardingStorage';

import StepIndicator from './_components/StepIndicator';
import AllergyStep from './_components/steps/AllergyStep';
import CookStateStep from './_components/steps/CookStateStep';
import RefrigeratorStep from './_components/steps/RefrigeratorStep';

const steps = [
  {
    description: '제외하고 추천해드릴게요!',
    id: 1,
    title: '못먹는 음식을 알려주세요',
  },
  {
    description: '상태와 재료 딱 두 가지만 알려주세요!',
    id: 2,
    title: '요리할 여유가 얼마나 있나요?',
  },
  {
    description: '두 가지만 골라도 요리를 찾아드려요',
    id: 3,
    title: '현재 냉장고에 어떤 재료를 \n가지고 계신가요?',
  },
];

function OnboardingContent() {
  const currentStep = useCurrentStep();
  const currentStepData = steps[currentStep - 1];

  // 온보딩 스토어 액션들
  const setCurrentStep = useOnboardingStore(state => state.setCurrentStep);
  const setStepData = useOnboardingStore(state => state.setStepData);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );

  // 복구 다이얼로그 상태
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoreData, setRestoreData] = useState<any>(null);

  // 온보딩 데이터 복구 로직
  useEffect(() => {
    const restoreOnboardingProgress = () => {
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

    restoreOnboardingProgress();
  }, []);

  // 복구 확인 처리
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

    setShowRestoreDialog(false);
    setRestoreData(null);
  };

  // 복구 거부 처리
  const handleRestoreCancel = () => {
    console.info('🗑️ 사용자가 데이터 복구를 거부함');
    onboardingStorage.clearData();
    setShowRestoreDialog(false);
    setRestoreData(null);
  };

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
      {showRestoreDialog && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              이전 온보딩 데이터 발견
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              이전에 진행하던 온보딩이 있습니다.
              <br />
              이어서 진행하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestoreCancel}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                새로 시작
              </button>
              <button
                onClick={handleRestoreConfirm}
                className="flex-1 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                이어서 진행
              </button>
            </div>
          </div>
        </div>
      )}

      <StepIndicator />

      <div className="mt-10 mb-4 text-center">
        <h2 className="text-24 mb-1 whitespace-pre-line">
          {currentStepData.title}
        </h2>
        <p className="text-18 text-gray-600">{currentStepData.description}</p>
      </div>

      <div>{renderCurrentStep()}</div>
    </>
  );
}

export default function OnboardingPage() {
  return <OnboardingContent />;
}
