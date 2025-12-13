'use client';

import { useEffect, useRef, useState } from 'react';

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  className?: string;
  initialEditing?: boolean; // 외부에서 편집 모드로 시작할지 여부
}

export function EditableCell({
  className,
  initialEditing = false,
  onSave,
  type = 'text',
  value,
}: EditableCellProps) {
  // '-' 또는 falsy 값을 빈 문자열로 처리
  const normalizeEmptyValue = (val: string | number) => {
    if (val === '-' || val === null || val === undefined) {
      return '';
    }
    return String(val);
  };

  const normalizedValue = normalizeEmptyValue(value);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 편집 모드 진입 시 즉시 포커스 및 선택, editValue 초기화
  useEffect(() => {
    if (isEditing && inputRef.current) {
      setEditValue(normalizedValue);
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, normalizedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // number 타입일 때 숫자만 허용
    if (type === 'number') {
      if (newValue === '' || /^\d+$/.test(newValue)) {
        setEditValue(newValue);
      }
      // 유효하지 않은 입력은 무시
    } else {
      setEditValue(newValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (type === 'number') {
      const numValue = parseInt(editValue, 10);
      if (!isNaN(numValue) && numValue > 0) {
        onSave(numValue);
      } else {
        // 유효하지 않은 값이면 원래 값으로 복원하거나 1로 설정
        const originalNum = parseInt(normalizedValue, 10);
        if (!isNaN(originalNum) && originalNum > 0) {
          setEditValue(normalizedValue);
        } else {
          setEditValue('1');
          onSave(1);
        }
      }
    } else {
      onSave(editValue);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(normalizedValue);
      setIsEditing(false);
    } else if (type === 'number') {
      // 음수 기호, 소수점 등 입력 방지
      if (
        e.key === '-' ||
        e.key === '+' ||
        e.key === '.' ||
        e.key === 'e' ||
        e.key === 'E'
      ) {
        e.preventDefault();
      }
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode={type === 'number' ? 'numeric' : 'text'}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`border-primary w-full border-b-2 focus:outline-none ${className ?? ''}`}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer hover:bg-gray-50 ${className ?? ''}`}
    >
      {normalizedValue || '-'}
    </div>
  );
}
