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
  formId: string;
}) {
  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="w-full space-y-8"
      aria-label="알레르기 선택 양식"
    >
      {categories.map((category, index) => (
        <div key={category.title} className="space-y-4">
          <h2
            id={`allergy-section-${index}`}
            className="scroll-mt-20 text-xl font-semibold text-gray-900"
          >
            {category.title}
          </h2>
          <AllergyCheckItem
            items={category.items}
            label=""
            selectedItems={selectedItems}
            onItemToggle={onItemToggle}
          />
        </div>
      ))}
    </form>
  );
}
