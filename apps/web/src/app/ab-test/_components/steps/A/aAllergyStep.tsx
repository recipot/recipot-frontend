'use client';

import { useEffect, useMemo, useState } from 'react';

import { ABProgressBar } from '@/app/ab-test/_components';
import { A_ALLERGY_STEP_CONFIG } from '@/app/ab-test/_constants';
import { Allergy, useAllergyContext } from '@/components/Allergy';
import { Header } from '@/components/common/Header';
import { useAllergiesStore } from '@/stores/allergiesStore';

interface ABAllergyStepProps {
  onNext: () => void;
  onBack?: () => void;
}

const SCROLLBAR_HIDE_STYLE: React.CSSProperties = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};

function ABAllergyStepContent({ onBack, onNext }: ABAllergyStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedItems } = useAllergyContext();

  const setAllergies = useAllergiesStore(state => state.setAllergies);
  const setSelectedItems = useAllergiesStore(state => state.setSelectedItems);

  // 선택된 항목이 있는지 확인
  const hasSelectedItems = selectedItems.length > 0;

  useEffect(() => {
    setSelectedItems(selectedItems);
  }, [selectedItems, setSelectedItems]);

  const handleSubmit = async (data: { items: number[] }) => {
    try {
      setIsSubmitting(true);

      setAllergies(data.items);
      setSelectedItems(selectedItems);

      onNext();
    } catch (error) {
      console.error('알러지 저장 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <Header>
        <Header.Back onClick={onBack} />
      </Header>
      <Header.Spacer />
      <ABProgressBar currentStep={1} totalSteps={3} currentOnly />

      <div className="mt-10 mb-4 text-center">
        <h1 className="text-24b mb-1 whitespace-pre-line">
          {A_ALLERGY_STEP_CONFIG.title}
        </h1>
        <p className="text-18 text-gray-600">
          {A_ALLERGY_STEP_CONFIG.description}
        </p>
      </div>

      <Allergy.LoadingState className="h-screen" />
      <Allergy.ErrorState className="h-screen" />

      <div className="sticky top-[60px] z-10 bg-white py-4">
        <div
          className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={SCROLLBAR_HIDE_STYLE}
        >
          <Allergy.Navigation />
        </div>
      </div>

      <div className="p-6">
        <Allergy.Content onSubmit={handleSubmit} />
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-center bg-gradient-to-t from-white via-white to-transparent px-6 py-[10px] pt-8">
        <Allergy.SubmitButton
          className="w-full max-w-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : A_ALLERGY_STEP_CONFIG.buttonText}
        </Allergy.SubmitButton>
      </div>
    </div>
  );
}

export default function ABAllergyStep({ onBack, onNext }: ABAllergyStepProps) {
  const persistedSelectedItems = useAllergiesStore(
    state => state.selectedItems
  );

  const initialSelectedItems = useMemo(
    () => [...persistedSelectedItems],
    [persistedSelectedItems]
  );

  const scrollConfig = useMemo(
    () => ({
      navigationOffset: 130,
      useWindowScroll: true,
    }),
    []
  );

  return (
    <Allergy
      formId="ab-allergy-form"
      initialSelectedItems={initialSelectedItems}
      isOnboarding
      scrollConfig={scrollConfig}
    >
      <ABAllergyStepContent onNext={onNext} onBack={onBack} />
    </Allergy>
  );
}
