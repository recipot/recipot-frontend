import React from 'react';

import { cn } from '@/lib/utils';

interface EmotionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function EmotionButton({
  isSelected,
  label,
  onClick,
}: EmotionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-[10px] border p-3',
        isSelected
          ? 'bg-secondary-light-green border-secondary-soft-green text-primary'
          : 'border-gray-300 bg-white text-gray-600'
      )}
    >
      <p className="text-15sb xs:text-13sb xs:text-nowrap">{label}</p>
    </button>
  );
}
