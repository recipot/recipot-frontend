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
  const [editValue, setEditValue] = useState(normalizedValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // value prop이 변경될 때 editValue 업데이트 (편집 중이 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(normalizedValue);
    }
  }, [normalizedValue, isEditing]);

  // 편집 모드 진입 시 즉시 포커스 및 선택
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    // 더블클릭 시 빈 문자열로 초기화하여 즉시 입력 가능하도록
    setEditValue(normalizedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // number 타입일 때 음수 입력 방지
    if (type === 'number') {
      // 빈 문자열이거나 숫자만 허용 (음수 기호 제거)
      if (newValue === '' || /^\d+$/.test(newValue)) {
        setEditValue(newValue);
      }
      // 음수 기호가 포함된 경우 무시
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
        type={type}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={type === 'number' ? 1 : undefined}
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
