'use client';

import type { AllergyCategory } from '@/types/allergy.types';

import AllergyCheckItem from '../legacy/AllergyCheckItem';

// 동적 높이 스타일 (뷰포트 높이 기반)
const dynamicHeightStyle = {
  minHeight: 'calc(100vh - 160px)', // 마지막 섹션이 최상단까지 올 수 있도록
  paddingBottom: 'calc(100vh - 160px)', // 헤더(56px) + 네비(32px) + 여백(72px) 고려
};

/**
 * AllergyCheckPresenter
 * @param categories - 카테고리별 알레르기 항목 배열
 * @param selectedItems - 선택된 항목 ID 배열
 * @param onItemToggle - 항목 토글 함수
 * @param onSubmit - 폼 제출 함수
 * @param formId - form의 고유 ID (외부 버튼에서 사용)
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckPresenter({
  categories,
  formId,
  onItemToggle,
  onSubmit,
  selectedItems,
}: {
  categories: AllergyCategory[];
  formId: string;
  onItemToggle: (itemId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedItems: number[];
}) {
  return (
    <form
      id={formId}
      aria-label="알레르기 선택 양식"
      className="w-full space-y-8"
      style={dynamicHeightStyle}
      onSubmit={onSubmit}
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
            groupLabel={category.title}
            items={category.items}
            selectedItems={selectedItems}
            useFieldset={false}
            onItemToggle={onItemToggle}
          />
        </fieldset>
      ))}
    </form>
  );
}
