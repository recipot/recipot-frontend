'use client';

import { useState } from 'react';
import { recipe as recipeService } from '@recipot/api';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tokenUtils } from 'packages/api/src/auth';

import { COMPLETED_RECIPES_QUERY_KEY } from '@/hooks/useCompletedRecipes';
import { useCookingOrder } from '@/hooks/useCookingOrder';
import { isProduction } from '@/lib/env';

import { useCookingOrderNavigation } from '../../../../../../hooks/useCookingOrderNavigation';
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
  const { completeStep, error, isLoading, recipe } = useCookingOrder(recipeId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const token = tokenUtils.getToken();
  const useCookieAuth = isProduction;

  // 모달 상태 통합 관리
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const {
    currentStep,
    handleNextStep,
    handlePrevStep,
    isFirstStep,
    isLastStep,
  } = useCookingOrderNavigation(recipe);

  // 모달 핸들러 통합
  const openModal = (modalType: ModalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  const handleCookingComplete = async () => {
    // await completeCooking();
    if (!useCookieAuth && !token) {
      router.push('/signin');
      return;
    }

    await recipeService.completeCooking(recipeId);
    completeStep(currentStep);

    // 완료한 레시피 캐시 무효화 - 메인 페이지에서 최신 데이터 반영
    queryClient.invalidateQueries({
      queryKey: COMPLETED_RECIPES_QUERY_KEY,
    });

    const completedRecipeId = recipeId;
    router.push(`/review?completedRecipeId=${completedRecipeId}`);
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
    <div className="mx-auto min-h-screen max-w-sm bg-white">
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
