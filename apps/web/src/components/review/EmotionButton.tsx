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
      onClick={onClick}
      className={cn(
        'h-[47px] w-[108px] rounded-[10px] border p-3',
        isSelected
          ? 'bg-secondary-light-green border-secondary-soft-green text-primary border'
          : 'border border-neutral-300 bg-white text-gray-500'
      )}
    >
      <p className="text-15sb xs:text-13sb xs:text-nowrap">{label}</p>
    </button>
  );
}
