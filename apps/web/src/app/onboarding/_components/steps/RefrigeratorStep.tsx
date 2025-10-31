'use client';

import { useEffect, useState } from 'react';
import { condition, onboarding } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import LoadingPage from '@/components/common/Loading/LoadingPage';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useMoodStore } from '@/stores/moodStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { ONBOARDING_CONSTANTS } from '../../_constants';
import { useOnboardingActions } from '../../_hooks';
import {
  getSubmitButtonText,
  moodToConditionId,
  onboardingStyles,
} from '../../_utils';

export default function RefrigeratorStep() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed, markStepCompleted } =
    useOnboardingActions();

  // 온보딩 진행 상태만 관리하는 스토어 초기화 함수
  const resetOnboardingStore = useOnboardingStore(state => state.resetStore);

  // 새로고침용: 선택된 재료만 임시로 초기화
  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const displayName = user?.nickname ?? '회원님';

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
      // 1. 모든 온보딩 데이터 수집 (각 도메인 스토어에서)
      const { allergies } = useAllergiesStore.getState();
      const { mood } = useMoodStore.getState();
      const { selectedFoodIds } = useSelectedFoodsStore.getState();

      if (!mood) {
        throw new Error(
          '기분 데이터가 없습니다. 이전 단계로 돌아가 다시 시도해주세요.'
        );
      }

      const completeData = {
        allergies,
        mood,
        selectedFoods: selectedFoodIds,
      };

      // 2. 데이터 유효성 검증
      const validation = onboarding.validateOnboardingData(completeData);
      if (!validation.isValid) {
        throw new Error(`입력 데이터 오류: ${validation.errors.join(', ')}`);
      }

      console.info('🚀 통합 온보딩 데이터 전송 시작:', completeData);

      // 3. 병렬 API 호출: 온보딩 완료 + 컨디션 저장
      const conditionId = moodToConditionId(
        completeData.mood as 'bad' | 'neutral' | 'good'
      );

      await Promise.all([
        onboarding.submitComplete(completeData),
        condition
          .saveDailyCondition({
            conditionId,
            isRecommendationStarted: true,
          })
          .catch(conditionError => {
            console.error('⚠️ 일일 컨디션 저장 실패:', conditionError);
          }),
      ]);

      console.info('✅ 모든 온보딩 API 호출 완료');

      // 4. 온보딩 완료 처리
      markStepCompleted(1);
      markStepCompleted(2);
      markStepCompleted(3);

      await completeOnboarding();

      // 5. 온보딩 진행 상태만 초기화 (도메인 데이터는 유지)
      // 알레르기, 기분, 선택한 음식은 다른 페이지에서 사용하므로 초기화하지 않음
      resetOnboardingStore();

      console.info('✅ 온보딩 완료!', {
        allergies: completeData.allergies,
        mood: completeData.mood,
        selectedFoods: completeData.selectedFoods,
      });

      router.push('/recipeRecommend');
    } catch (error) {
      console.error('❌ 온보딩 완료 실패:', error);

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

  if (isSubmitting) {
    return (
      <LoadingPage>
        {displayName}님의
        <br />
        지금 바로 해먹을 수 있는 요리를
        <br />
        찾고 있어요
      </LoadingPage>
    );
  }

  return (
    <>
      <IngredientsSearch onSelectionChange={handleSelectionChange} />

      <div className={onboardingStyles.submitButton.wrapper}>
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
