import { useState } from 'react';

import type { Recipe } from '@/types/recipe.types';

export function useCookingOrderNavigation(recipe: Recipe | null) {
  const [currentStep, setCurrentStep] = useState(1);

  // recipe와 steps가 존재하는지 안전하게 확인
  const stepsLength = recipe?.steps?.length ?? 0;

  const handleNextStep = () => {
    if (recipe && stepsLength > 0 && currentStep < stepsLength) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = stepsLength > 0 ? currentStep === stepsLength : false;

  return {
    currentStep,
    handleNextStep,
    handlePrevStep,
    handleReset,
    isFirstStep,
    isLastStep,
  };
}
