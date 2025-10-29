import { useOnboardingStore } from '@/stores/onboardingStore';

/**
 * 온보딩 스토어 액션들을 모아놓은 훅
 * 여러 컴포넌트에서 반복 사용되는 액션들을 중앙화
 *
 * 주의: 실제 데이터는 각 도메인 스토어에서 관리됩니다:
 * - allergiesStore: 알러지 데이터
 * - moodStore: 기분/컨디션 데이터
 * - selectedFoodsStore: 선택된 음식 데이터
 */
export function useOnboardingActions() {
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const resetStore = useOnboardingStore(state => state.resetStore);
  const setCurrentStep = useOnboardingStore(state => state.setCurrentStep);

  // 새로고침 관련 액션들
  const clearRefreshFlag = useOnboardingStore(state => state.clearRefreshFlag);
  const isRefreshed = useOnboardingStore(state => state.isRefreshed);

  return {
    // 네비게이션 액션
    goToNextStep,
    goToPreviousStep,
    setCurrentStep,

    // 데이터 관리 액션
    markStepCompleted,
    resetStore,

    // 새로고침 관련
    clearRefreshFlag,
    isRefreshed,
  };
}
