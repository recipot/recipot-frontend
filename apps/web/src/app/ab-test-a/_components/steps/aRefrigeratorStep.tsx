'use client';

import { useCallback, useEffect, useState } from 'react';

import { ONBOARDING_CONSTANTS } from '@/app/onboarding/_constants';
import { useOnboardingActions } from '@/app/onboarding/_hooks';
import { getSubmitButtonText, onboardingStyles } from '@/app/onboarding/_utils';
import { Button } from '@/components/common/Button';
import { IngredientsSearch } from '@/components/IngredientsSearch';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

interface RefrigeratorStepProps {
  onNext: () => void;
  onStepClick?: (step: number) => void;
}

export default function RefrigeratorStep({ onNext }: RefrigeratorStepProps) {
  // 온보딩 액션들
  const { clearRefreshFlag, isRefreshed } = useOnboardingActions();

  // 새로고침용: 선택된 재료만 임시로 초기화
  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새로고침 버튼을 눌렀을 때만 선택된 재료들 초기화
  useEffect(() => {
    if (isRefreshed) {
      clearAllFoods();
      setSelectedCount(0);
      clearRefreshFlag();
    }
  }, [isRefreshed, clearAllFoods, clearRefreshFlag]);

  const handleComplete = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const { selectedFoodIds } = useSelectedFoodsStore.getState();

      if (selectedFoodIds.length < ONBOARDING_CONSTANTS.MIN_SELECTED_FOODS) {
        throw new Error('최소 재료 개수를 선택해주세요.');
      }

      console.info('✅ 냉장고 재료 선택 완료:', selectedFoodIds);

      // 다음 단계로 이동
      onNext();
    } catch (error) {
      console.error('❌ 냉장고 재료 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onNext]);

  const handleSelectionChange = (count: number) => {
    setSelectedCount(count);
  };

  return (
    <>
      <IngredientsSearch onSelectionChange={handleSelectionChange} />

      <div className={onboardingStyles.submitButton.wrapper}>
        <Button
          onClick={handleComplete}
          disabled={
            selectedCount < ONBOARDING_CONSTANTS.MIN_SELECTED_FOODS ||
            isSubmitting
          }
        >
          {getSubmitButtonText(isSubmitting, 2)}
        </Button>
      </div>
    </>
  );
}
