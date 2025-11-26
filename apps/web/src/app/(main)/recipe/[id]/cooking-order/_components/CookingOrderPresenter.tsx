'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useIsLoggedIn } from '@/hooks';
import { useCompleteCooking } from '@/hooks/useCompleteCooking';
import { useCookingOrder } from '@/hooks/useCookingOrder';
import { useCookingOrderNavigation } from '@/hooks/useCookingOrderNavigation';
import { checkIsNaN } from '@/lib/checkIsNaN';
import { useApiErrorModalStore } from '@/stores';
import { useLoginModalStore } from '@/stores/useLoginModalStore';

import CookingOrderContent from './CookingOrderContent';
import CookingOrderFooter from './CookingOrderFooter';
import CookingOrderHeader from './CookingOrderHeader';
import { IngredientsSidebar } from './IngredientsSidebar';
import WarningModal from './WarningModal';

// 모달 타입 정의
type ModalType = 'ingredients' | 'warning' | null;

interface CookingOrderPresenterProps {
  recipeId: string;
}

export default function CookingOrderPresenter({
  recipeId,
}: CookingOrderPresenterProps) {
  const { completeStep, getCompletedRecipeId, isLoading, recipe } =
    useCookingOrder(recipeId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeCookingMutation = useCompleteCooking();

  const isLoggedIn = useIsLoggedIn();
  const openLoginModal = useLoginModalStore(state => state.openModal);

  // 모달 상태 통합 관리
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [hasRequestedLogin, setHasRequestedLogin] = useState(false);

  const shouldShowLoginModal = !isLoading && !isLoggedIn && !hasRequestedLogin;

  useEffect(() => {
    if (shouldShowLoginModal) {
      openLoginModal();
      setHasRequestedLogin(true);
    }
  }, [shouldShowLoginModal, openLoginModal]);

  useEffect(() => {
    if (isLoggedIn) {
      setHasRequestedLogin(false);
    }
  }, [isLoggedIn]);

  const stepParam = searchParams.get('step');
  const lastStepFlag = searchParams.get('lastStep') === 'true';
  const parsedStep = stepParam ? Number(stepParam) : null;
  const hasValidStepParam = parsedStep ? checkIsNaN(parsedStep) : false;

  let initialStep = 1;

  if (hasValidStepParam && parsedStep) {
    initialStep = parsedStep;
  } else if (lastStepFlag && recipe?.steps?.length) {
    initialStep = recipe.steps.length;
  }

  const {
    currentStep,
    handleNextStep,
    handlePrevStep,
    isFirstStep,
    isLastStep,
  } = useCookingOrderNavigation(recipe, initialStep);

  // 모달 핸들러 통합
  const openModal = (modalType: ModalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const handleCookingComplete = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    const completedRecipeId = getCompletedRecipeId();
    if (!completedRecipeId) {
      useApiErrorModalStore.getState().showError({
        message: '요리 완료에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
      return;
    }
    await completeCookingMutation.mutateAsync(completedRecipeId);
    completeStep(currentStep);
    router.push(
      `/review?completedRecipeId=${completedRecipeId}&recipeId=${recipeId}`
    );
  };
  const handleBack = () => {
    openModal('warning');
  };

  const handleConfirm = () => {
    router.push(`/recipe/${recipeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (shouldShowLoginModal) {
    return null;
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
    <div className="mx-auto min-h-screen bg-white">
      <CookingOrderHeader
        recipe={recipe}
        onBack={handleBack}
        onShowIngredients={() => openModal('ingredients')}
      />

      <CookingOrderContent recipe={recipe} currentStep={currentStep} />

      <CookingOrderFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onStepComplete={handleCookingComplete}
      />

      <IngredientsSidebar
        isOpen={activeModal === 'ingredients'}
        onClose={closeModal}
        recipe={recipe}
      />

      <WarningModal
        isOpen={activeModal === 'warning'}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
