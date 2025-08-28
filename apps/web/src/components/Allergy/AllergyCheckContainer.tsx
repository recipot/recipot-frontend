'use client';

import AllergyCheckPresenter from './AllergyCheckPresenter';
import useAllergyCheck from './useAllergyCheck';

import type { AllergyFormSchema } from './Allergy.constants';
import type { z } from 'zod';

/**
 * AllergyCheckContainer
 * @param onSubmit - onSubmit function
 * @param formId - form의 고유 ID (외부 버튼에서 사용)
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckContainer({
  formId,
  onSubmit,
}: {
  formId?: string;
  onSubmit: (data: z.infer<typeof AllergyFormSchema>) => void;
}) {
  const { handleItemToggle, selectedItems } = useAllergyCheck();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 선택된 항목들을 ID 순서대로 정렬하여 전송
    const sortedItems = [...selectedItems].sort((a, b) => a - b);
    onSubmit({ items: sortedItems });
  };

  return (
    <AllergyCheckPresenter
      selectedItems={selectedItems}
      onItemToggle={handleItemToggle}
      onSubmit={handleSubmit}
      formId={formId}
    />
  );
}
