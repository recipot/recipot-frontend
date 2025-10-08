'use client';

import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';
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
    <header className="fixed top-0 right-0 left-0 z-10 flex h-14 items-center justify-between bg-white px-3 py-2">
      {currentStep > 1 ? (
        <button
          className="flex size-10 items-center justify-center"
          onClick={handleBackClick}
        >
          <BackIcon size={24} />
        </button>
      ) : (
        <div className="size-10" />
      )}
      <button
        className="flex size-10 items-center justify-center"
        onClick={handleRefreshClick}
      >
        <RefreshIcon size={24} />
      </button>
    </header>
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
      <div>{children}</div>
    </>
  );
}
