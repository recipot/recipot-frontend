'use client';

import { allergyPost } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { AllergyCheckContainer, useAllergyCheck } from '@/components/Allergy';
import { Button } from '@/components/common/Button';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function AllergyStep() {
  const { handleItemToggle, selectedItems } = useAllergyCheck();
  const goToNextStep = useOnboardingStore(state => state.goToNextStep);
  const markStepCompleted = useOnboardingStore(
    state => state.markStepCompleted
  );
  const setStepData = useOnboardingStore(state => state.setStepData);

  const allergyMutation = useMutation({
    mutationFn: allergyPost,
    onError: error => {
      console.error('API 호출 실패:', error);
    },
    onSuccess: data => {
      console.log('API 호출 성공:', data);
      // 데이터 저장 및 다음 단계로 이동
      setStepData(1, { apiResponse: data, selectedItems });
      markStepCompleted(1);
      goToNextStep();
    },
  });

  const handleSubmit = (data: { items: number[] }) => {
    allergyMutation.mutate({ categories: data.items });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <AllergyCheckContainer
        formId="allergy-form"
        onSubmit={handleSubmit}
        selectedItems={selectedItems}
        onItemToggle={handleItemToggle}
      />

      <div className="fixed right-0 bottom-0 left-0 flex justify-center px-6 py-[10px]">
        <Button
          form="allergy-form"
          disabled={allergyMutation.isPending}
          type="submit"
        >
          여유에 맞는 요리 추천받기
        </Button>
      </div>
    </div>
  );
}
