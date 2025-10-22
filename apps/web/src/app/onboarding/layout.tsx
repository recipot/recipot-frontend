'use client';

import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header';
import { RefreshIcon } from '@/components/Icons';
import { useOnboardingStore } from '@/stores/onboardingStore';

function OnboardingHeader() {
  const router = useRouter();
  const currentStep = useOnboardingStore(state => state.currentStep);
  const canGoToPreviousStep = useOnboardingStore(
    state => state.canGoToPreviousStep
  );
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const resetCurrentStep = useOnboardingStore(state => state.resetCurrentStep);

  const handleBackClick = () => {
    if (canGoToPreviousStep()) {
      goToPreviousStep();
    } else {
      // 첫 번째 step이면 이전 페이지로 이동
      router.back();
    }
  };

  const handleRefreshClick = () => {
    // 현재 step의 데이터만 초기화
    resetCurrentStep();
    console.info('refresh');
  };

  return (
    <Header>
      <Header.Back show={currentStep > 1} onClick={handleBackClick} />
      <Header.Action onClick={handleRefreshClick} ariaLabel="새로고침">
        <RefreshIcon size={24} />
      </Header.Action>
    </Header>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OnboardingHeader />
      <Header.Spacer />
      <div>{children}</div>
    </>
  );
}
