import { useState } from 'react';

import type { Recipe } from '@/types/recipe.types';

export function useCookingOrderNavigation(recipe: Recipe | null) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (recipe && currentStep < recipe.cookingSteps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = recipe
    ? currentStep === recipe.cookingSteps.length
    : false;

  return {
    currentStep,
    handleNextStep,
    handlePrevStep,

    isFirstStep,
    isLastStep,
  };
}
