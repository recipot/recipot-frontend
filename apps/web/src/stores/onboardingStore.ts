'use client';

import { create } from 'zustand';

import type { OnboardingStepDataMap } from '@/app/onboarding/_types';

/**
 * 온보딩 스테이트 인터페이스
 */
interface OnboardingState {
  /** 현재 단계 (1-3) */
  currentStep: number;
  /** 완료된 단계들 */
  completedSteps: number[];
  /** 각 단계별 데이터 */
  stepData: Partial<OnboardingStepDataMap>;
  /** 새로고침 플래그 */
  isRefreshed: boolean;
}

/**
 * 온보딩 스토어 액션들
 */
interface OnboardingActions {
  /** 현재 단계 설정 */
  setCurrentStep: (step: number) => void;
  /** 특정 단계의 데이터 설정 */
  setStepData: <T extends keyof OnboardingStepDataMap>(
    step: T,
    data: OnboardingStepDataMap[T]
  ) => void;
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
  /** 현재 단계 초기화 */
  resetCurrentStep: () => void;
  /** 전체 스토어 초기화 */
  resetStore: () => void;
  /** 새로고침 플래그 리셋 */
  clearRefreshFlag: () => void;
}

/** 총 온보딩 단계 수 */
const TOTAL_STEPS = 3;

/** 초기 상태 */
const initialState: OnboardingState = {
  completedSteps: [],
  currentStep: 1,
  isRefreshed: false,
  stepData: {},
};

/**
 * 온보딩 관리를 위한 Zustand 스토어
 *
 * 기능:
 * - 단계별 진행 상태 관리
 * - 단계별 데이터 저장
 * - 온보딩 완료 처리
 * - 단계 이동 및 검증
 */
export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
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
      const { currentStep } = get();
      set(state => {
        const newStepData = { ...state.stepData };
        delete newStepData[currentStep as keyof OnboardingStepDataMap];
        return {
          isRefreshed: true, // 새로고침 플래그 설정
          stepData: newStepData,
        };
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

    setStepData: <T extends keyof OnboardingStepDataMap>(
      step: T,
      data: OnboardingStepDataMap[T]
    ) => {
      set(state => ({
        stepData: {
          ...state.stepData,
          [step]: data,
        },
      }));
    },
  })
);

/**
 * 온보딩 스토어의 특정 값들만 선택적으로 구독하는 훅들
 * 성능 최적화를 위해 필요한 값들만 구독
 */

/** 현재 단계만 구독 */
export const useCurrentStep = () =>
  useOnboardingStore(state => state.currentStep);

/** 완료된 단계들만 구독 */
export const useCompletedSteps = () =>
  useOnboardingStore(state => state.completedSteps);

/** 1단계 (알레르기) 데이터 구독 */
export const useAllergyStepData = () =>
  useOnboardingStore(state => state.stepData[1]);

/** 2단계 (요리 상태) 데이터 구독 */
export const useCookStateStepData = () =>
  useOnboardingStore(state => state.stepData[2]);

/** 3단계 (냉장고) 데이터 구독 */
export const useRefrigeratorStepData = () =>
  useOnboardingStore(state => state.stepData[3]);

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
  const setStepData = useOnboardingStore(state => state.setStepData);
  const stepData = useOnboardingStore(state => state.stepData);

  return {
    resetCurrentStep,
    resetStore,
    setStepData,
    stepData,
  };
};
