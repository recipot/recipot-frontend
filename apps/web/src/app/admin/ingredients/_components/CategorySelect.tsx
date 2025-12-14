'use client';

import { useEffect, useRef } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IngredientCategory } from '@/types/ingredients.types';

interface CategorySelectProps {
  value: number | null;
  categories: IngredientCategory[];
  isEditing: boolean;
  onChange: (value: number) => void;
  onBlur: () => void;
}

export function CategorySelect({
  categories,
  isEditing,
  onBlur,
  onChange,
  value,
}: CategorySelectProps) {
  const selectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.click();
    }
  }, [isEditing]);

  const displayValue = categories.find(c => c.id === value)?.name ?? '';

  if (isEditing) {
    return (
      <Select
        value={value?.toString() ?? ''}
        onValueChange={newValue => {
          onChange(parseInt(newValue));
          onBlur();
        }}
      >
        <SelectTrigger ref={selectRef} className="w-full">
          <SelectValue placeholder="선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex min-h-[40px] items-center">
      {displayValue ?? <span className="text-gray-400">더블클릭하여 선택</span>}
    </div>
  );
}
