'use client';

import { cn } from '@/lib/utils';

import type { AllergyCheckItem } from './Allergy.constants';

/**
 * AllergyCheckItem
 * @param items - AllergyCheckItem[]
 * @param label - string
 * @param selectedItems - number[]
 * @param onItemToggle - (itemId: number) => void
 * @returns AllergyCheckItem component
 */
export default function AllergyCheckItem({
  items,
  label,
  onItemToggle,
  selectedItems,
}: {
  items: AllergyCheckItem[];
  label: string;
  selectedItems: number[];
  onItemToggle: (itemId: number) => void;
}) {
  return (
    <div className="space-y-4">
      <label className="text-18sb" htmlFor={label} id={label}>
        {label}
      </label>
      <div className="text-15sb grid grid-cols-3 gap-3">
        {items.map(item => (
          // TODO : 추후 공통 컴포넌트로 변경 필요
          <button
            key={item.id}
            type="button"
            onClick={() => onItemToggle(item.id)}
            className={cn(
              // 공통 스타일
              'h-10 w-full rounded-[10px] border-[1.2px] p-3 leading-none transition-all duration-200',
              // 상태별 스타일
              selectedItems.includes(item.id)
                ? 'border-secondary-soft-green bg-secondary-light-green text-primary'
                : 'border-gray-300 bg-white hover:border-gray-300'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
