'use client';

import { createContext, useContext, useState } from 'react';

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
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const TOTAL_STEPS = 3;

export function OnboardingProvider({ children }: { children: ReactNode }) {
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

  const value: OnboardingContextType = {
    canGoToNextStep,
    canGoToPreviousStep,
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
