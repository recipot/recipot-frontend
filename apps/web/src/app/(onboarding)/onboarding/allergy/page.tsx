'use client';

import { allergyPost } from '@recipot/api';
import { useMutation } from '@tanstack/react-query';

import { AllergyCheckContainer, useAllergyCheck } from '@/components/Allergy';
import { Button } from '@/components/common/Button';

export default function AllergyPage() {
  const { handleItemReset, handleItemToggle, selectedItems } =
    useAllergyCheck();

  const allergyMutation = useMutation({
    mutationFn: allergyPost,
    onError: error => {
      console.error('API 호출 실패:', error);
    },
    onSuccess: data => {
      console.info('API 호출 성공:', data);
    },
  });

  const handleSubmit = (data: { items: number[] }) => {
    allergyMutation.mutate({ categories: data.items });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="sr-only">알레르기 정보를 선택해주세요.</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={handleItemReset}
        disabled={selectedItems.length === 0}
      >
        선택 초기화
      </Button>
      <AllergyCheckContainer
        formId="allergy-form"
        onSubmit={handleSubmit}
        selectedItems={selectedItems}
        onItemToggle={handleItemToggle}
      />
      <Button form="allergy-form" size="full" type="submit" className="mt-4">
        선택하기
      </Button>
    </div>
  );
}
