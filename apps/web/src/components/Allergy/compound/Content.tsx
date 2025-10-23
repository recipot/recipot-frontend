'use client';

import { useAllergyContext } from '../context/AllergyContext';
import AllergyCheckPresenter from '../legacy/AllergyCheckPresenter';

interface AllergyContentProps {
  className?: string;
  onSubmit?: (data: { items: number[] }) => void;
}

/**
 * Allergy.Content
 * 알레르기 항목 체크리스트 콘텐츠
 *
 * @param className - 추가 스타일
 * @param onSubmit - 폼 제출 핸들러
 */
export default function AllergyContent({
  className = '',
  onSubmit,
}: AllergyContentProps) {
  const {
    categories,
    formId,
    handleCategoryToggle,
    handleItemToggle,
    selectedItems,
  } = useAllergyContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 선택된 항목들을 ID 순서대로 정렬하여 전송
    const sortedItems = [...selectedItems].sort((a, b) => a - b);
    onSubmit?.({ items: sortedItems });
  };

  return (
    <div className={className}>
      <AllergyCheckPresenter
        categories={categories}
        formId={formId}
        selectedItems={selectedItems}
        onCategoryToggle={handleCategoryToggle}
        onItemToggle={handleItemToggle}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
