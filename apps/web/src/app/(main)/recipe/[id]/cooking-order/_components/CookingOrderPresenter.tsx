'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { useCompleteCooking } from '@/hooks/useCompleteCooking';
import { useCookingOrder } from '@/hooks/useCookingOrder';
import { useCookingOrderNavigation } from '@/hooks/useCookingOrderNavigation';
import { isProduction } from '@/lib/env';
import { useApiErrorModalStore } from '@/stores';

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
  const { completeStep, error, getCompletedRecipeId, isLoading, recipe } =
    useCookingOrder(recipeId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeCookingMutation = useCompleteCooking();

  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  // 모달 상태 통합 관리
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const stepParam = searchParams.get('step');
  const lastStepFlag = searchParams.get('lastStep') === 'true';

  const initialStep = stepParam
    ? parseInt(stepParam, 10)
    : lastStepFlag && recipe?.steps?.length
      ? recipe.steps.length
      : 1;

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
    if (!useCookieAuth && !token) {
      router.push('/signin');
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
