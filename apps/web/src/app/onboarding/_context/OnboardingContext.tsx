'use client';

import { createContext, useContext, useState } from 'react';
import { useAuth } from '@recipot/contexts';

import type { ReactNode } from 'react';

interface OnboardingState {
  currentStep: number;
  completedSteps: number[];
  stepData: {
    [key: number]: any;
  };
}

interface OnboardingContextType {
  state: OnboardingState;
  setCurrentStep: (step: number) => void;
  setStepData: (step: number, data: any) => void;
  markStepCompleted: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepCompleted: (step: number) => boolean;
  canGoToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const TOTAL_STEPS = 3;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { setUser, user } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    completedSteps: [],
    currentStep: 1,
    stepData: {},
  });

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setStepData = (step: number, data: any) => {
    setState(prev => ({
      ...prev,
      stepData: { ...prev.stepData, [step]: data },
    }));
  };

  const markStepCompleted = (step: number) => {
    setState(prev => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, step])],
    }));
  };

  const goToNextStep = () => {
    if (state.currentStep < TOTAL_STEPS) {
      setCurrentStep(state.currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (state.currentStep > 1) {
      setCurrentStep(state.currentStep - 1);
    }
  };

  const isStepCompleted = (step: number) => {
    return state.completedSteps.includes(step);
  };

  const canGoToNextStep = () => {
    return state.currentStep < TOTAL_STEPS;
  };

  const canGoToPreviousStep = () => {
    return state.currentStep > 1;
  };

  const completeOnboarding = () => {
    if (user) {
      // 사용자의 온보딩 완료 상태 업데이트
      setUser({
        ...user,
        isOnboardingCompleted: true,
      });
    }
  };

  const value: OnboardingContextType = {
    canGoToNextStep,
    canGoToPreviousStep,
    completeOnboarding,
    goToNextStep,
    goToPreviousStep,
    isStepCompleted,
    markStepCompleted,
    setCurrentStep,
    setStepData,
    state,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
