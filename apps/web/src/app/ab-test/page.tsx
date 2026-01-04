'use client';

import './_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ConditionStep,
  IngredientsStep,
  RecipeResultStep,
} from './_components/steps';
import { useABTestStep } from './_hooks';

/**
 * A/B 테스트 페이지
 * URL 파라미터 ?variant=B로 B안 플로우를 실행합니다.
 * 로그인 없이도 컨디션 선택 → 재료 검색 → 레시피 추천을 진행할 수 있습니다.
 */
export default function ABTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant');

  const { currentStep, goToNextStep, goToStep } = useABTestStep();

  // variant=B가 아니면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (variant !== 'B') {
      router.replace('/');
    }
  }, [variant, router]);

  // variant=B가 아닌 경우 로딩 표시
  if (variant !== 'B') {
    return null;
  }

  // 현재 스텝에 따른 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 2:
        return <IngredientsStep onNext={goToNextStep} onStepClick={goToStep} />;
      case 3:
        return <RecipeResultStep onStepClick={goToStep} />;
      default:
        return <ConditionStep onNext={goToNextStep} onStepClick={goToStep} />;
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-white">
      {renderCurrentStep()}
    </div>
  );
}
