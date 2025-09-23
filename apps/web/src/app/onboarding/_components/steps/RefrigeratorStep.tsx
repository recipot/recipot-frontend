'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import {
  IngredientsSearch,
  type IngredientsSearchRef,
} from '@/components/IngredientsSearch';

import { useOnboarding } from '../../_context/OnboardingContext';

export default function RefrigeratorStep() {
  const { markStepCompleted, setStepData } = useOnboarding();
  const ingredientsSearchRef = useRef<IngredientsSearchRef>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
