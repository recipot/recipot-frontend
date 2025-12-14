'use client';

import { useEffect, useRef } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectCellProps {
  value: string;
  options: readonly string[];
  isEditing: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function SelectCell({
  isEditing,
  onBlur,
  onChange,
  options,
  value,
}: SelectCellProps) {
  const selectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.click();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <Select
        value={value}
        onValueChange={newValue => {
          onChange(newValue);
          onBlur();
        }}
      >
        <SelectTrigger ref={selectRef} className="w-full">
          <SelectValue placeholder="선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex min-h-[40px] items-center">
      {value || <span className="text-gray-400">더블클릭하여 선택</span>}
    </div>
  );
}
