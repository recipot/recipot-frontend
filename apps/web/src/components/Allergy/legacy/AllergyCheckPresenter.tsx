'use client';

import { Element } from 'react-scroll';

import CheckboxIcon from '@/components/common/CheckboxIcon';
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
 * @param onItemToggle - 항목 토글 함수 (연관된 모든 재료 ID를 전달)
 * @param onCategoryToggle - 카테고리 전체 선택/해제 함수
 * @param onSubmit - 폼 제출 함수
 * @param formId - form의 고유 ID (외부 버튼에서 사용)
 * @returns AllergyCheckPresenter component
 */
export default function AllergyCheckPresenter({
  categories,
  formId,
  onCategoryToggle,
  onItemToggle,
  onSubmit,
  selectedItems,
}: {
  categories: AllergyCategory[];
  formId: string;
  onCategoryToggle?: (categoryItemIds: number[]) => void;
  onItemToggle: (ingredientIds: number[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedItems: number[];
}) {
  // 카테고리의 모든 아이템이 선택되어 있는지 확인
  const isCategoryFullySelected = (category: AllergyCategory) => {
    if (category.items.length === 0) return false;
    return category.items.every(item =>
      item.linkedIngredientIds.every(id => selectedItems.includes(id))
    );
  };

  return (
    <form
      id={formId}
      aria-label="알레르기 선택 양식"
      className="w-full space-y-8"
      style={dynamicHeightStyle}
      onSubmit={onSubmit}
    >
      {categories.map((category, index) => {
        const categoryItemIds = category.items.flatMap(
          item => item.linkedIngredientIds
        );
        const uniqueCategoryItemIds = Array.from(new Set(categoryItemIds));
        const isFullySelected = isCategoryFullySelected(category);
        const sectionId = `allergy-section-${index}`;

        return (
          <Element key={category.title} name={sectionId} id={sectionId}>
            <fieldset className="space-y-4">
              <div className="flex items-center justify-between">
                <legend className="text-xl font-semibold text-gray-900">
                  {category.title}
                </legend>
                {onCategoryToggle && (
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => onCategoryToggle(uniqueCategoryItemIds)}
                    aria-label="전체선택"
                  >
                    <CheckboxIcon isSelected={isFullySelected} />
                    <span className="text-15 text-gray-700">전체선택</span>
                  </button>
                )}
              </div>
              <AllergyCheckItem
                groupLabel={category.title}
                items={category.items}
                selectedItems={selectedItems}
                useFieldset={false}
                onItemToggle={onItemToggle}
              />
            </fieldset>
          </Element>
        );
      })}
    </form>
  );
}
