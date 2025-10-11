import { useOnboardingStore } from '@/stores/onboardingStore';

/**
 * 온보딩 스토어 액션들을 모아놓은 훅
 * 여러 컴포넌트에서 반복 사용되는 액션들을 중앙화
 */
export function useOnboardingActions() {
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const setCurrentStep = useOnboardingStore(state => state.setCurrentStep);
  const setStepData = useOnboardingStore(state => state.setStepData);

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
    setStepData,

    // 새로고침 관련
    clearRefreshFlag,
    isRefreshed,
  };
}
