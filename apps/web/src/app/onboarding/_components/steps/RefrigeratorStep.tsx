'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@recipot/contexts';

import { Button } from '@/components/common/Button';
import {
  IngredientsSearch,
  type IngredientsSearchRef,
} from '@/components/IngredientsSearch';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

export default function RefrigeratorStep() {
  const { setUser, user } = useAuth();
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const setStepData = useOnboardingStore(state => state.setStepData);

  // 저장된 데이터 불러오기
  const stepData = useOnboardingStore(state => state.stepData[3]);
  const isRefreshed = useOnboardingStore(state => state.isRefreshed);
  const clearRefreshFlag = useOnboardingStore(state => state.clearRefreshFlag);
  const clearAllFoods = useSelectedFoodsStore(state => state.clearAllFoods);

  const ingredientsSearchRef = useRef<IngredientsSearchRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새로고침 버튼을 눌렀을 때만 선택된 재료들 초기화
  useEffect(() => {
    if (isRefreshed && stepData && Object.keys(stepData).length === 0) {
      clearAllFoods();
      setSelectedCount(0);
      clearRefreshFlag(); // 플래그 리셋
    }
  }, [stepData, isRefreshed, clearAllFoods, clearRefreshFlag]);

  // 온보딩 완료 처리
  const completeOnboarding = () => {
    if (user) {
      setUser({
        ...user,
        isOnboardingCompleted: true,
      });
    }
  };

  const handleComplete = () => {
    // IngredientsSearch의 제출 로직 호출
    if (ingredientsSearchRef.current) {
      ingredientsSearchRef.current.submitSelectedFoods();
    }
  };

  const handleSelectionChange = (count: number) => {
    setSelectedCount(count);
  };

  const handleSubmissionStateChange = (submitting: boolean) => {
    setIsSubmitting(submitting);
  };

  const handleSubmissionSuccess = () => {
    console.info(
      '재료 선택이 완료되었습니다. 레시피 추천 페이지로 이동합니다.'
    );

    // 온보딩 완료 처리
    const refrigeratorData = {
      /* 냉장고 재료 데이터 */
    };
    setStepData(3, refrigeratorData);
    markStepCompleted(3);
    completeOnboarding(); // 온보딩 완료 상태 업데이트
    console.info('온보딩 완료!', refrigeratorData);
    // TODO: 메인 페이지로 이동하거나 완료 처리
  };

  return (
    <>
      <IngredientsSearch
        ref={ingredientsSearchRef}
        onSubmissionSuccess={handleSubmissionSuccess}
        onSelectionChange={handleSelectionChange}
        onSubmissionStateChange={handleSubmissionStateChange}
      />

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          onClick={handleComplete}
          disabled={selectedCount < 2 || isSubmitting}
        >
          여유에 맞는 요리 추천받기
        </Button>
      </div>
    </>
  );
}
