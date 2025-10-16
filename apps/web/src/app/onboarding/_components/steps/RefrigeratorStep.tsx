'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { onboardingAPI } from '@/api/onboardingAPI';
import { Button } from '@/components/common/Button';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { ONBOARDING_CONSTANTS } from '../../_constants';
import { useOnboardingActions } from '../../_hooks';
import { getSubmitButtonText, onboardingStorage } from '../../_utils';

/**
 * stepData가 빈 객체인지 안전하게 확인하는 헬퍼 함수
 * @param stepData - 확인할 스텝 데이터
 * @returns stepData가 존재하고 빈 객체인 경우 true
 */
const isStepDataEmpty = (stepData: unknown): boolean => {
  return (
    stepData != null &&
    typeof stepData === 'object' &&
    Object.keys(stepData).length === 0
  );
};

export default function RefrigeratorStep() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed, markStepCompleted, setStepData } =
    useOnboardingActions();

  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[3]);
  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새로고침 버튼을 눌렀을 때만 선택된 재료들 초기화
  useEffect(() => {
    if (isRefreshed && isStepDataEmpty(stepData)) {
      clearAllFoods();
      setSelectedCount(0);
      clearRefreshFlag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepData, isRefreshed]);

  // 온보딩 완료 처리
  const completeOnboarding = () => {
    if (user) {
      setUser({
        ...user,
        isOnboardingCompleted: true,
      });
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);

      // 1. 현재 스텝 데이터 저장
      const { selectedFoodIds } = useSelectedFoodsStore.getState();
      onboardingStorage.saveStepData(3, {
        selectedFoods: selectedFoodIds,
      });

      // 2. 모든 온보딩 데이터 수집
      const completeData = onboardingStorage.getCompleteOnboardingData();

      if (!completeData) {
        throw new Error(
          '온보딩 데이터가 불완전합니다. 처음부터 다시 진행해주세요.'
        );
      }

      // 3. 데이터 유효성 검증
      const validation = onboardingAPI.validateOnboardingData(completeData);
      if (!validation.isValid) {
        throw new Error(`입력 데이터 오류: ${validation.errors.join(', ')}`);
      }

      console.info('🚀 통합 온보딩 데이터 전송 시작:', completeData);

      // 4. 통합 API 호출
      const result = await onboardingAPI.submitComplete(completeData);

      if (result.success) {
        // 5. 온보딩 완료 처리 - clearData 전에 Zustand 스토어에 모든 데이터 저장
        // 알레르기 데이터 저장
        setStepData(1, {
          allergies: completeData.allergies,
          selectedItems: completeData.allergies,
        });
        markStepCompleted(1);

        // 냉장고 데이터 저장
        const refrigeratorData = {
          selectedFoods: selectedFoodIds,
        };
        setStepData(3, refrigeratorData);
        markStepCompleted(3);

        completeOnboarding();

        // 6. localStorage 데이터 정리 (Zustand는 유지됨)
        onboardingStorage.clearData();

        console.info('✅ 온보딩 완료!', {
          allergies: completeData.allergies,
          mood: completeData.mood,
          selectedFoods: completeData.selectedFoods,
        });

        router.push('/');
      } else {
        throw new Error(result.message || '온보딩 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 온보딩 완료 실패:', error);

      // 사용자에게 에러 메시지 표시
      // TODO: 에러 토스트 메시지 표시
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      alert(
        `온보딩 완료 중 오류가 발생했습니다.\n\n${errorMessage}\n\n다시 시도해주세요.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectionChange = (count: number) => {
    setSelectedCount(count);
  };

  return (
    <>
      <IngredientsSearch onSelectionChange={handleSelectionChange} />

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          onClick={handleComplete}
          disabled={
            selectedCount < ONBOARDING_CONSTANTS.MIN_SELECTED_FOODS ||
            isSubmitting
          }
        >
          {getSubmitButtonText(isSubmitting, 3)}
        </Button>
      </div>
    </>
  );
}
