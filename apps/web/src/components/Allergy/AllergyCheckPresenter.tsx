'use client';

import { categories } from './Allergy.constants';
import AllergyCheckItem from './AllergyCheckItem';

// 동적 높이 스타일 (뷰포트 높이 기반)
const dynamicHeightStyle = {
  minHeight: 'calc(100vh - 160px)', // 마지막 섹션이 최상단까지 올 수 있도록
  paddingBottom: 'calc(100vh - 160px)', // 헤더(56px) + 네비(32px) + 여백(72px) 고려
};

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
      style={dynamicHeightStyle}
      aria-label="알레르기 선택 양식"
    >
      {categories.map((category, index) => (
        <fieldset key={category.title} className="space-y-4">
          <legend
            id={`allergy-section-${index}`}
            className="scroll-mt-20 text-xl font-semibold text-gray-900"
          >
            {category.title}
          </legend>
          <AllergyCheckItem
            items={category.items}
            selectedItems={selectedItems}
            onItemToggle={onItemToggle}
          />
        </fieldset>
      ))}
    </form>
  );
}
