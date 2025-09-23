'use client';

import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';

import {
  OnboardingProvider,
  useOnboarding,
} from './_context/OnboardingContext';

function OnboardingHeader() {
  const router = useRouter();
  const { canGoToPreviousStep, goToPreviousStep, state } = useOnboarding();

  const handleBackClick = () => {
    if (canGoToPreviousStep()) {
      goToPreviousStep();
    } else {
      // 첫 번째 step이면 이전 페이지로 이동
      router.back();
    }
  };

  const handleRefreshClick = () => {
    // 현재 step 초기화 (새로고침)
    window.location.reload();
  };

  return (
    <header className="flex h-14 items-center justify-between px-3 py-2">
      {state.currentStep > 1 ? (
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

function OnboardingLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OnboardingHeader />
      <div>{children}</div>
    </>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <OnboardingLayoutContent>{children}</OnboardingLayoutContent>
    </OnboardingProvider>
  );
}
