import { useState } from 'react';

import type { Recipe } from '@/types/recipe.types';

export function useCookingOrderNavigation(recipe: Recipe | null) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (recipe && currentStep < (recipe?.steps?.length ?? 0)) {
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
  const isLastStep = recipe
    ? currentStep === (recipe.steps?.length ?? 0)
    : false;

  return {
    currentStep,
    handleNextStep,
    handlePrevStep,
    handleReset,
    isFirstStep,
    isLastStep,
  };
}
