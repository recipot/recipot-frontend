'use client';

import AllergyCheckPresenter from './AllergyCheckPresenter';

import type { AllergyFormSchema } from './Allergy.constants';
import type { z } from 'zod';

/**
 * AllergyCheckContainer
 * @param onSubmit - onSubmit function
 * @param formId - form의 고유 ID (외부 버튼에서 사용)
 * @param selectedItems - 선택된 알레르기 항목 배열
 * @param onItemToggle - 알레르기 항목 토글 함수
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckContainer({
  formId,
  onItemToggle,
  onSubmit,
  selectedItems,
}: {
  formId: string;
  onSubmit: (data: z.infer<typeof AllergyFormSchema>) => void;
  selectedItems: number[];
  onItemToggle: (id: number) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 선택된 항목들을 ID 순서대로 정렬하여 전송
    const sortedItems = [...selectedItems].sort((a, b) => a - b);
    onSubmit({ items: sortedItems });
  };

  return (
    <AllergyCheckPresenter
      selectedItems={selectedItems}
      onItemToggle={onItemToggle}
      onSubmit={handleSubmit}
      formId={formId}
    />
  );
}
