'use client';

import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header';
import { RefreshIcon } from '@/components/Icons';
import { useAllergiesStore } from '@/stores/allergiesStore';
import { useMoodStore } from '@/stores/moodStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useSelectedFoodsStore } from '@/stores/selectedFoodsStore';

function OnboardingHeader() {
  const router = useRouter();
  const currentStep = useOnboardingStore(state => state.currentStep);
  const canGoToPreviousStep = useOnboardingStore(
    state => state.canGoToPreviousStep
  );
  const goToPreviousStep = useOnboardingStore(state => state.goToPreviousStep);
  const resetCurrentStep = useOnboardingStore(state => state.resetCurrentStep);
  const hasAllergySelection = useAllergiesStore(
    state => state.allergies.length > 0 || state.selectedItems.length > 0
  );
  const hasMoodSelection = useMoodStore(state => state.mood !== null);
  const hasFoodSelection = useSelectedFoodsStore(
    state => state.selectedFoodIds.length > 0
  );

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

  const hasSelection =
    (currentStep === 1 && hasAllergySelection) ||
    (currentStep === 2 && hasMoodSelection) ||
    (currentStep === 3 && hasFoodSelection);

  const refreshIconColor = hasSelection ? 'hsl(var(--gray-900))' : undefined;

  return (
    <Header>
      <Header.Back show={currentStep > 1} onClick={handleBackClick} />
      <Header.Action onClick={handleRefreshClick} ariaLabel="새로고침">
        <RefreshIcon size={24} color={refreshIconColor} />
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
