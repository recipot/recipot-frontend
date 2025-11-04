'use client';

import { useCallback, useEffect, useState } from 'react';
import { condition, onboarding } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import LoadingPage from '@/components/common/Loading/LoadingPage';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
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

const MIN_LOADING_DURATION_MS = 2500; // 최소 로딩 시간 (ms) - 온보딩은 조금 더 길게
const FADE_OUT_DURATION = 300; // fade out 애니메이션 시간 (ms)
const FADE_TRANSITION = { duration: 0.3 }; // fade in/out 애니메이션 설정

export default function RefrigeratorStep() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  const navigateWithoutScroll = useCallback(
    (path: string) => router.push(path, { scroll: false }),
    [router]
  );
  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed, markStepCompleted } =
    useOnboardingActions();

  // 온보딩 진행 상태만 관리하는 스토어 초기화 함수
  const resetOnboardingStore = useOnboardingStore(state => state.resetStore);

  // 새로고침용: 선택된 재료만 임시로 초기화
  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
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
    setIsSubmitting(true);
    const loadingStart = Date.now();

    // 로딩 오버레이 표시
    setIsLoadingRecipes(true);

    try {
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

      // 최소 로딩 시간이 지나지 않았다면 추가로 대기
      const elapsed = Date.now() - loadingStart;
      if (elapsed < MIN_LOADING_DURATION_MS) {
        await new Promise(resolve =>
          setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed)
        );
      }

      // 로딩 오버레이 숨기기 (fade out 애니메이션)
      setIsLoadingRecipes(false);

      // fade out 애니메이션이 완료된 후 페이지 이동
      await new Promise(resolve => setTimeout(resolve, FADE_OUT_DURATION));

      setIsSubmitting(false);
      navigateWithoutScroll('/recipeRecommend');
    } catch (error) {
      console.error('❌ 온보딩 완료 실패:', error);

      // 에러 발생 시에도 최소 로딩 시간 보장
      const elapsed = Date.now() - loadingStart;
      if (elapsed < MIN_LOADING_DURATION_MS) {
        await new Promise(resolve =>
          setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed)
        );
      }

      setIsLoadingRecipes(false);
      setIsSubmitting(false);

      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      useApiErrorModalStore.getState().showError({
        message: `온보딩 완료 중 오류가 발생했습니다.\n\n${errorMessage}\n다시 시도해주세요.`,
      });
    }
  };

  const handleSelectionChange = (count: number) => {
    setSelectedCount(count);
  };

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

      {/* 로딩 오버레이 - fade in/out 애니메이션 */}
      <AnimatePresence>
        {isLoadingRecipes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE_TRANSITION}
            className="fixed inset-0 z-[100]"
          >
            <LoadingPage>
              {displayName}님의
              <br />
              지금 바로 해먹을 수 있는 요리를
              <br />
              찾고 있어요
            </LoadingPage>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
