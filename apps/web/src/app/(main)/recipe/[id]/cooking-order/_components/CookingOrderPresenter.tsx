'use client';

import { useState } from 'react';
import axios from 'axios';
import { tokenUtils } from 'packages/api/src/auth';

import { useCookingOrder } from '@/hooks/useCookingOrder';

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

  const token = tokenUtils.getToken();

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
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/recipes/${recipeId}/complete`,
      {
        recipeId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    completeStep(currentStep);
  };

  const handleBack = () => {
    openModal('warning');
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

      <WarningModal isOpen={activeModal === 'warning'} onClose={closeModal} />
    </div>
  );
}
