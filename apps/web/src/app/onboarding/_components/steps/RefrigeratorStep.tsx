'use client';

import { useEffect, useState } from 'react';
import { condition, onboarding } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { ONBOARDING_CONSTANTS } from '../../_constants';
import { useOnboardingActions } from '../../_hooks';
import {
  getSubmitButtonText,
  moodToConditionId,
  onboardingStorage,
} from '../../_utils';

export default function RefrigeratorStep() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed, markStepCompleted, setStepData } =
    useOnboardingActions();

  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새로고침 버튼을 눌렀을 때만 선택된 재료들 초기화
  useEffect(() => {
    if (isRefreshed) {
      clearAllFoods();
      setSelectedCount(0);
      clearRefreshFlag();
    }
  }, [isRefreshed, clearAllFoods, clearRefreshFlag]);

  // 온보딩 완료 처리 : isFirstEntry 플래그 업데이트
  const completeOnboarding = async () => {
    if (user?.isFirstEntry) {
      try {
        // TODO: 백엔드 API 구현 대기 중
        // PATCH /v1/users/profile 엔드포인트로 isFirstEntry를 false로 업데이트
        // 백엔드에서 API가 준비되면 주석을 해제하세요
        // const updatedUser = await authService.updateProfile({
        //   isFirstEntry: false,
        // });
        // setUser(updatedUser);

        // 임시: 클라이언트 상태만 업데이트
        setUser({
          ...user,
          isFirstEntry: false,
        });
        console.info('✅ 온보딩 완료: isFirstEntry 플래그 업데이트');
      } catch (error) {
        console.error('❌ isFirstEntry 업데이트 실패:', error);
        // 실패해도 온보딩은 완료된 것으로 처리 (UX 우선)
        setUser({
          ...user,
          isFirstEntry: false,
        });
      }
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
      const validation = onboarding.validateOnboardingData(completeData);
      if (!validation.isValid) {
        throw new Error(`입력 데이터 오류: ${validation.errors.join(', ')}`);
      }

      console.info('🚀 통합 온보딩 데이터 전송 시작:', completeData);

      // 4. 병렬 API 호출: 온보딩 완료 + 컨디션 저장
      const conditionId = moodToConditionId(
        completeData.mood as 'bad' | 'neutral' | 'good'
      );

      await Promise.all([
        // 못먹는 음식 저장 + 온보딩 완료 플래그 (development에서는 플래그만 건너뜀)
        onboarding.submitComplete(completeData),
        // 일일 컨디션 저장
        condition
          .saveDailyCondition({
            conditionId,
            isRecommendationStarted: true,
          })
          .catch(conditionError => {
            // 컨디션 저장 실패는 로그만 남기고 온보딩 진행 계속
            console.error('⚠️ 일일 컨디션 저장 실패:', conditionError);
          }),
      ]);

      console.info('✅ 모든 온보딩 API 호출 완료');

      // 6. 온보딩 완료 처리 - clearData 전에 Zustand 스토어에 모든 데이터 저장
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

      await completeOnboarding();

      // 7. localStorage 데이터 정리 (Zustand는 유지됨)
      onboardingStorage.clearData();

      console.info('✅ 온보딩 완료!', {
        allergies: completeData.allergies,
        mood: completeData.mood,
        selectedFoods: completeData.selectedFoods,
      });

      router.push('/');
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
