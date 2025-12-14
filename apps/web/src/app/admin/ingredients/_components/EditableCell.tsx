'use client';

import { useEffect, useRef } from 'react';

import { Input } from '@/components/ui/input';

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export function EditableCell({
  error,
  isEditing,
  onBlur,
  onChange,
  value,
}: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onBlur();
            }
          }}
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-[40px] items-center">
      {value || <span className="text-gray-400">더블클릭하여 편집</span>}
    </div>
  );
}
