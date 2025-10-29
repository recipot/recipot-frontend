'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 온보딩 스테이트 인터페이스
 *
 * 주의: 실제 데이터(알러지, 기분, 선택된 음식)는 각각의 도메인 스토어에서 관리됩니다:
 * - allergiesStore: 알러지 데이터
 * - moodStore: 기분/컨디션 데이터
 * - selectedFoodsStore: 선택된 음식 데이터
 */
interface OnboardingState {
  /** 현재 단계 (1-3) */
  currentStep: number;
  /** 완료된 단계들 */
  completedSteps: number[];
  /** 새로고침 플래그 */
  isRefreshed: boolean;
  /** 현재 사용자 ID (세션 추적용) */
  userId: string | null;
}

/**
 * 온보딩 스토어 액션들
 */
interface OnboardingActions {
  /** 현재 단계 설정 */
  setCurrentStep: (step: number) => void;
  /** 단계 완료 표시 */
  markStepCompleted: (step: number) => void;
  /** 다음 단계로 이동 */
  goToNextStep: () => void;
  /** 이전 단계로 이동 */
  goToPreviousStep: () => void;
  /** 특정 단계 완료 여부 확인 */
  isStepCompleted: (step: number) => boolean;
  /** 다음 단계로 갈 수 있는지 확인 */
  canGoToNextStep: () => boolean;
  /** 이전 단계로 갈 수 있는지 확인 */
  canGoToPreviousStep: () => boolean;
  /** 온보딩 완료 처리 */
  completeOnboarding: () => void;
  /** 현재 단계 초기화 (새로고침 플래그 설정) */
  resetCurrentStep: () => void;
  /** 전체 스토어 초기화 */
  resetStore: () => void;
  /** 새로고침 플래그 리셋 */
  clearRefreshFlag: () => void;
  /** 사용자 세션 검증 및 필요시 초기화 */
  validateUserSession: (currentUserId: string | null) => void;
}

/** 총 온보딩 단계 수 */
const TOTAL_STEPS = 3;

/** 초기 상태 */
const initialState: OnboardingState = {
  completedSteps: [],
  currentStep: 1,
  isRefreshed: false,
  userId: null,
};

/**
 * 온보딩 관리를 위한 Zustand 스토어
 *
 * 기능:
 * - 단계별 진행 상태 관리
 * - 단계별 데이터 저장
 * - 온보딩 완료 처리
 * - 단계 이동 및 검증
 * - localStorage에 자동 저장 (persist)
 */
export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      // 초기 상태
      ...initialState,

      // 액션들
      canGoToNextStep: () => {
        const { currentStep } = get();
        return currentStep < TOTAL_STEPS;
      },

      canGoToPreviousStep: () => {
        const { currentStep } = get();
        return currentStep > 1;
      },

      clearRefreshFlag: () => {
        set({ isRefreshed: false });
      },

      completeOnboarding: () => {
        // AuthContext의 setUser를 사용하기 위해 훅을 여기서 직접 사용할 수 없으므로
        // 이 부분은 컴포넌트에서 처리하도록 변경해야 합니다.
        console.info('온보딩이 완료되었습니다.');
      },

      goToNextStep: () => {
        const { currentStep } = get();
        if (currentStep < TOTAL_STEPS) {
          set({ currentStep: currentStep + 1 });
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      isStepCompleted: (step: number) => {
        const { completedSteps } = get();
        return completedSteps.includes(step);
      },

      markStepCompleted: (step: number) => {
        set(state => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        }));
      },

      resetCurrentStep: () => {
        set({
          isRefreshed: true, // 새로고침 플래그 설정
        });
      },

      resetStore: () => {
        set(initialState);
      },

      setCurrentStep: (step: number) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
          set({ currentStep: step });
        }
      },

      validateUserSession: (currentUserId: string | null) => {
        const { userId } = get();

        // 사용자가 변경되었으면 온보딩 데이터 초기화
        if (userId !== null && userId !== currentUserId) {
          console.info('🔄 사용자 세션 변경 감지, 온보딩 데이터 초기화');
          set({ ...initialState, userId: currentUserId });
        } else if (userId === null) {
          // 첫 진입 시 userId 설정
          set({ userId: currentUserId });
        }
      },
    }),
    {
      name: 'onboarding-storage', // localStorage 키 이름
    }
  )
);

/**
 * 온보딩 스토어의 특정 값들만 선택적으로 구독하는 훅들
 * 성능 최적화를 위해 필요한 값들만 구독
 *
 * 주의: 실제 데이터(알러지, 기분, 선택된 음식)를 구독하려면 각 도메인 스토어를 사용하세요:
 * - useAllergiesStore: 알러지 데이터
 * - useMoodStore: 기분/컨디션 데이터
 * - useSelectedFoodsStore: 선택된 음식 데이터
 */

/** 현재 단계만 구독 */
export const useCurrentStep = () =>
  useOnboardingStore(state => state.currentStep);

/** 완료된 단계들만 구독 */
export const useCompletedSteps = () =>
  useOnboardingStore(state => state.completedSteps);

/** 네비게이션 액션들만 구독 */
export const useOnboardingNavigation = () => {
  const canGoToNextStep = useOnboardingStore(state => state.canGoToNextStep);
  const canGoToPreviousStep = useOnboardingStore(
    state => state.canGoToPreviousStep
  );
  const currentStep = useOnboardingStore(state => state.currentStep);
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const setCurrentStep = useOnboardingStore(state => state.setCurrentStep);

  return {
    canGoToNextStep,
    canGoToPreviousStep,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    setCurrentStep,
  };
};

/** 단계 완료 관련 액션들만 구독 */
export const useOnboardingCompletion = () => {
  const completedSteps = useOnboardingStore(state => state.completedSteps);
  const completeOnboarding = useOnboardingStore(
    state => state.completeOnboarding
  );
  const isStepCompleted = useOnboardingStore(state => state.isStepCompleted);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );

  return {
    completedSteps,
    completeOnboarding,
    isStepCompleted,
    markStepCompleted,
  };
};

/** 데이터 관리 액션들만 구독 */
export const useOnboardingData = () => {
  const resetCurrentStep = useOnboardingStore(state => state.resetCurrentStep);
  const resetStore = useOnboardingStore(state => state.resetStore);

  return {
    resetCurrentStep,
    resetStore,
  };
};
