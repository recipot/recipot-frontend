'use client';

import { useEffect } from 'react';
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
  // 사파리에서 최상단 도달 시 추가 스크롤(바운스) 방지
  // TODO: 테스트 후 제거
  useEffect(() => {
    let lastScrollY = 0;

    const preventOverscroll = (e: TouchEvent) => {
      const { scrollY } = window;

      // 최상단에서 위로 스크롤 시도하는 경우
      if (scrollY <= 0 && lastScrollY <= 0) {
        const target = e.target as HTMLElement;

        // 스크롤 가능한 요소 내부가 아닌 경우만 방지
        if (!target.closest('[data-scroll-container]')) {
          e.preventDefault();
        }
      }

      lastScrollY = scrollY;
    };

    document.addEventListener('touchmove', preventOverscroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchmove', preventOverscroll);
    };
  }, []);

  return (
    <>
      <OnboardingHeader />
      <Header.Spacer />
      <div>{children}</div>
    </>
  );
}
