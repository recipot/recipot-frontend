'use client';

import { memo } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '../common/Button';

import type { AllergyCheckItem } from './Allergy.constants';

/**
 * AllergyCheckItem
 * @param items - AllergyCheckItem[]
 * @param label - string
 * @param selectedItems - number[]
 * @param onItemToggle - (itemId: number) => void
 * @returns AllergyCheckItem component
 */
function AllergyCheckItem({
  htmlFor,
  items,
  label,
  onItemToggle,
  selectedItems,
}: {
  items: AllergyCheckItem[];
  label: string;
  htmlFor: string;
  selectedItems: number[];
  onItemToggle: (itemId: number) => void;
}) {
  const StyleActive =
    'border-secondary-soft-green bg-secondary-light-green text-primary';

  return (
    <div className="space-y-4">
      <label className="text-18sb" htmlFor={htmlFor} id={label}>
        {label}
      </label>
      <div className="text-15sb grid grid-cols-3 gap-3">
        {items.map(item => (
          <Button
            key={item.id}
            size="full"
            shape="square"
            type="button"
            onClick={() => onItemToggle(item.id)}
            variant="outline"
            className={cn(
              'h-10',
              selectedItems.includes(item.id) ? StyleActive : ''
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default memo(AllergyCheckItem);
