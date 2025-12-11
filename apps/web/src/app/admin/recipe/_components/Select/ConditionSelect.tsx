'use client';

import { useEffect, useRef } from 'react';

interface Condition {
  id: number;
  name: string;
}

interface ConditionSelectProps {
  conditions: Condition[];
  currentConditionId?: number;
  onSelect: (conditionId: number) => void;
  onClose: () => void;
}

export function ConditionSelect({
  conditions,
  currentConditionId,
  onClose,
  onSelect,
}: ConditionSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const conditionId = parseInt(e.target.value, 10);
    onSelect(conditionId);
    onClose();
  };

  const handleBlur = () => {
    onClose();
  };

  return (
    <select
      ref={selectRef}
      value={currentConditionId ?? ''}
      onChange={handleChange}
      onBlur={handleBlur}
      className="border-primary w-full border-b-2 focus:outline-none"
    >
      {conditions.map(condition => (
        <option key={condition.id} value={condition.id}>
          {condition.name}
        </option>
      ))}
    </select>
  );
}
