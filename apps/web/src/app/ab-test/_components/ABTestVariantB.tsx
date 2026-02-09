'use client';

import '@/app/ab-test/_styles/ab-test.css';
import '@/components/EmotionState/styles.css';

import { useState } from 'react';

import { IntroStep } from '@/app/ab-test/_components/steps';

import OnboardingFlow from './OnboardingFlow';

/**
 * A/B 테스트 B안 메인 컴포넌트
 * 플로우: 인트로(Lottie) -> 기존 온보딩 (못먹는음식 -> 컨디션 -> 재료입력 -> /recipeRecommend 이동)
 */
export default function ABTestVariantB() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (!showOnboarding) {
    return <IntroStep onNext={() => setShowOnboarding(true)} />;
  }

  return <OnboardingFlow />;
}
