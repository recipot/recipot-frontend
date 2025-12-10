'use client';

import { useEffect, useRef, useState } from 'react';

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'number';
  className?: string;
}

export function EditableCell({
  className,
  onSave,
  type = 'text',
  value,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(String(value));
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (type === 'number') {
      const numValue = parseInt(editValue, 10);
      if (!isNaN(numValue)) {
        onSave(numValue);
      } else {
        setEditValue(String(value));
      }
    } else {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full border-b-2 border-primary focus:outline-none ${className ?? ''}`}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer hover:bg-gray-50 ${className ?? ''}`}
    >
      {value || '-'}
    </div>
  );
}

