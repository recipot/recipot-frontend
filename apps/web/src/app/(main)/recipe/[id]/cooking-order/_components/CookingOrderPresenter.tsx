'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCookingOrder } from '@/hooks/useCookingOrder';

import { useCookingOrderNavigation } from '../../../../../../hooks/useCookingOrderNavigation';
import CompletionSidebar from './CompletionSidebar';
import CookingOrderContent from './CookingOrderContent';
import CookingOrderFooter from './CookingOrderFooter';
import CookingOrderHeader from './CookingOrderHeader';
import IngredientsSidebar from './IngredientsSidebar';
import WarningModal from './WarningModal';

interface CookingOrderPresenterProps {
  recipeId: string;
}

export default function CookingOrderPresenter({
  recipeId,
}: CookingOrderPresenterProps) {
  const { completeStep, error, isLoading, recipe, resetProgress } =
    useCookingOrder(recipeId);

  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [showCompletionSidebar, setShowCompletionSidebar] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const router = useRouter();

  const {
    currentStep,
    handleNextStep,
    handlePrevStep,
    handleReset,
    isFirstStep,
    isLastStep,
  } = useCookingOrderNavigation(recipe);

  const completeStepHandler = (stepNumber: number) => {
    completeStep(stepNumber);
  };

  const handleStepComplete = () => {
    completeStepHandler(currentStep);
    if (isLastStep) {
      // 바텀시트 띄우기
    } else {
      handleNextStep();
    }
  };

  const handleResetWithNavigation = () => {
    resetProgress();
    handleReset();
  };

  const handleBack = () => {
    setShowWarningModal(true);
  };

  const handleConfirmExit = ({ recipeId }: { recipeId: string }) => {
    // 레시피 상세 페이지로 되돌아가는 로직 필요
    // recipeId는 params로?
    router.push(`/recipe/${recipeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            레시피를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            레시피를 찾을 수 없습니다
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-sm bg-white">
      <CookingOrderHeader
        recipe={recipe}
        onBack={handleBack}
        onShowIngredients={() => setShowIngredientsModal(true)}
      />

      <CookingOrderContent recipe={recipe} currentStep={currentStep} />

      <CookingOrderFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onStepComplete={handleStepComplete}
      />

      <IngredientsSidebar
        isOpen={showIngredientsModal}
        onClose={() => setShowIngredientsModal(false)}
        recipe={recipe}
      />

      <CompletionSidebar
        isOpen={showCompletionSidebar}
        onClose={() => setShowCompletionSidebar(false)}
        onReset={handleResetWithNavigation}
        recipe={recipe}
      />

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={() => handleConfirmExit({ recipeId })}
      />
    </div>
  );
}
