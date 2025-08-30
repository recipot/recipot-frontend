'use client';

import { categories } from './Allergy.constants';
import AllergyCheckItem from './AllergyCheckItem';

/**
 * AllergyCheckPresenter
 * @param selectedItems - number[]
 * @param onItemToggle - (itemId: number) => void
 * @param onSubmit - (e: React.FormEvent) => void
 * @param formId - form의 고유 ID (외부 버튼에서 사용)
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckPresenter({
  formId,
  onItemToggle,
  onSubmit,
  selectedItems,
}: {
  selectedItems: number[];
  onItemToggle: (itemId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  formId?: string;
}) {
  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="w-full space-y-8"
      aria-label="알레르기 선택 양식"
    >
      {categories.map(category => (
        <AllergyCheckItem
          key={category.title}
          items={category.items}
          label={category.title}
          selectedItems={selectedItems}
          onItemToggle={onItemToggle}
        />
      ))}
    </form>
  );
}
