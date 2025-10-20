'use client';

import { memo } from 'react';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';
import type { AllergyCheckItem } from '@/types/allergy.types';

/**
 * AllergyCheckItem
 * @param items - AllergyCheckItem[]
 * @param selectedItems - number[]
 * @param onItemToggle - (itemId: number) => void
 * @param groupLabel - 그룹의 라벨 (접근성용, 선택적)
 * @param useFieldset - fieldset/legend 사용 여부 (기본값: true)
 * @returns AllergyCheckItem component
 */
function AllergyCheckItem({
  groupLabel,
  items,
  onItemToggle,
  selectedItems,
  useFieldset = true,
}: {
  groupLabel?: string;
  items: AllergyCheckItem[];
  onItemToggle: (itemId: number) => void;
  selectedItems: number[];
  useFieldset?: boolean;
}) {
  const StyleActive =
    'border-secondary-soft-green bg-secondary-light-green text-primary';

  const buttonElements = items.map(item => (
    <Button
      key={item.id}
      className={cn('h-10', selectedItems.includes(item.id) ? StyleActive : '')}
      shape="square"
      size="full"
      type="button"
      variant="outline"
      onClick={() => onItemToggle(item.id)}
    >
      {item.label}
    </Button>
  ));

  // fieldset을 사용하지 않는 경우 (AllergyCheckPresenter에서 이미 fieldset으로 감싸진 경우)
  if (!useFieldset) {
    return (
      <div
        aria-label={groupLabel}
        className="text-15sb grid grid-cols-3 gap-3"
        role="group"
      >
        {buttonElements}
      </div>
    );
  }

  // 독립적으로 사용되는 경우 fieldset/legend 제공
  return (
    <fieldset className="space-y-4">
      {groupLabel && (
        <legend className="text-xl font-semibold text-gray-900">
          {groupLabel}
        </legend>
      )}
      <div className="text-15sb grid grid-cols-3 gap-3">{buttonElements}</div>
    </fieldset>
  );
}

export default memo(AllergyCheckItem);
