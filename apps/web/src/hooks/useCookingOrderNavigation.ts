import { useEffect, useState } from 'react';

import type { Recipe } from '@/app/recipe/[id]/types/recipe.types';

export function useCookingOrderNavigation(
  recipe: Recipe | null,
  initialStep = 1
) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  // recipe와 steps가 존재하는지 안전하게 확인
  const stepsLength = recipe?.steps?.length ?? 0;

  const handleNextStep = () => {
    if (recipe && currentStep < (recipe?.steps?.length ?? 0)) {
      if (recipe && stepsLength > 0 && currentStep < stepsLength) {
        setCurrentStep(prev => prev + 1);
      }
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
