'use client';

import { useCallback, useEffect, useState } from 'react';
import { condition, onboarding } from '@recipot/api';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { useOnboardingActions } from '@/app/onboarding/_hooks';
import { moodToConditionId } from '@/app/onboarding/_utils';
import LoadingPage from '@/components/common/Loading/LoadingPage';
import {
  EmotionBackground,
  EmotionSelector,
  type MoodType,
} from '@/components/EmotionState';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useApiErrorModalStore } from '@/stores/apiErrorModalStore';
import { useMoodStore } from '@/stores/moodStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

import { AB_STEP_CONFIG } from '../../_constants';
import ABPageLayout from '../ABPageLayout';

const MIN_LOADING_DURATION_MS = 1000;

interface CookStateStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export default function CookStateStep({ onNext }: CookStateStepProps) {
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

  // 저장된 데이터 불러오기
  const savedMood = useMoodStore(state => state.mood);
  const setMood = useMoodStore(state => state.setMood);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(savedMood);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const displayName = user?.nickname ?? '회원님';

  // 새로고침 버튼을 눌렀을 때만 로컬 상태 초기화
  useEffect(() => {
    if (isRefreshed) {
      setSelectedMood(null);
      clearRefreshFlag();
    }
  }, [isRefreshed, clearRefreshFlag]);

  const handleMoodSelect = (mood: MoodType) => {
    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    setMood(newMood);
  };

  // 온보딩 완료 처리: isFirstEntry 플래그 업데이트
  const completeOnboarding = async () => {
    if (user?.isFirstEntry) {
      try {
        setUser({
          ...user,
          isFirstEntry: false,
        });
        console.info('✅ 온보딩 완료: isFirstEntry 플래그 업데이트');
      } catch (error) {
        console.error('❌ isFirstEntry 업데이트 실패:', error);
        setUser({
          ...user,
          isFirstEntry: false,
        });
      }
    }
  };

  const handleNext = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    const loadingStart = Date.now();

    try {
      // 1. 모든 온보딩 데이터 수집
      const { allergies } = useAllergiesStore.getState();
      const { mood } = useMoodStore.getState();
      const { selectedFoodIds } = useSelectedFoodsStore.getState();

      if (!mood) {
        throw new Error('기분 데이터가 없습니다.');
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

      // 5. 온보딩 진행 상태만 초기화
      resetOnboardingStore();

      console.info('✅ 온보딩 완료!', {
        allergies: completeData.allergies,
        mood: completeData.mood,
        selectedFoods: completeData.selectedFoods,
      });

      // 최소 로딩 시간 보장
      const elapsed = Date.now() - loadingStart;
      if (elapsed < MIN_LOADING_DURATION_MS) {
        await new Promise(resolve =>
          setTimeout(resolve, MIN_LOADING_DURATION_MS - elapsed)
        );
      }

      // 레시피 추천 페이지로 이동
      navigateWithoutScroll('/recipeRecommend');
    } catch (error) {
      console.error('❌ 온보딩 완료 실패:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';

      useApiErrorModalStore.getState().showError({
        message: `온보딩 완료 중 오류가 발생했습니다.\n\n${errorMessage}\n다시 시도해주세요.`,
      });

      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="fixed top-0 left-0 z-50 h-full w-full">
        <LoadingPage>
          {displayName}님의
          <br />
          지금 바로 해먹을 수 있는 요리를
          <br />
          찾고 있어요
        </LoadingPage>
      </div>
    );
  }

  const stepConfig = AB_STEP_CONFIG[2];

  return (
    <div className="relative overflow-hidden">
      {/* 배경 - 전체 화면 고정 */}
      <EmotionBackground mood={selectedMood} className="fixed inset-0 -z-10" />
      <ABPageLayout
        currentStep={2}
        title={stepConfig.title}
        question={stepConfig.question}
        buttonText="레시피 추천받을게요"
        onButtonClick={handleNext}
      >
        {/* 기분 선택 버튼 영역 - 화면 중앙 */}
        <div className="flex h-[calc(100vh-20rem)] items-center justify-center">
          <EmotionSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>
      </ABPageLayout>
    </div>
  );
}
