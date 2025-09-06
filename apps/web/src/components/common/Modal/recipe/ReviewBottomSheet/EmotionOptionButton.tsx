import React from 'react';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';
import { cn } from '@/lib/utils';

export interface FeelingPillProps {
  label: string;
  color: 'blue' | 'yellow' | 'red';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function EmotionOptionButton({
  color,
  disabled,
  label,
  onClick,
  selected,
}: FeelingPillProps) {
  const baseByColor: Record<FeelingPillProps['color'], string> = {
    blue: 'bg-[#D4E2FF] text-feel-tired-text',
    red: 'bg-[#FFE2E2] text-[#D25D5D]',
    yellow: 'bg-[#FDFAB0] text-feel-soso-text',
  };

  const unselectedByColor: Record<FeelingPillProps['color'], string> = {
    blue: 'bg-gray-100 text-gray-500',
    red: 'bg-gray-100 text-gray-500',
    yellow: 'bg-gray-100 text-gray-500',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-[80px] w-[85px] flex-shrink-0 flex-col items-center justify-center gap-[4px] rounded-2xl text-xs font-semibold sm:h-[94px] sm:w-[106px] sm:gap-[6px] sm:text-sm',
        disabled && 'cursor-not-allowed opacity-60',
        selected ? baseByColor[color] : unselectedByColor[color]
      )}
      aria-pressed={!!selected}
    >
      <span className="text-xl leading-none sm:text-2xl">
        {color === 'blue' && (
          <EmotionBadIcon
            color={selected ? 'hsl(var(--feel-tired-text))' : '#9CA3AF'}
          />
        )}
        {color === 'yellow' && (
          <EmotionNeutralIcon
            color={selected ? 'hsl(var(--feel-soso-text))' : '#9CA3AF'}
          />
        )}
        {color === 'red' && (
          <EmotionGoodIcon
            color={selected ? 'hsl(var(--feel-free-text))' : '#9CA3AF'}
          />
        )}
      </span>
      <span className="xs:text-12sb text-15sb">{label}</span>
    </button>
  );
}

export default EmotionOptionButton;
