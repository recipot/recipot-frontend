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

function EmotionOptionButton({
  color,
  disabled,
  label,
  onClick,
  selected,
}: FeelingPillProps) {
  // 선택된 버튼의 색상 (원래 색상)
  const getBaseColor = (color: FeelingPillProps['color']): string => {
    switch (color) {
      case 'blue':
        return 'bg-[#D4E2FF] text-feel-tired-text';
      case 'red':
        return 'bg-[#FFE2E2] text-feel-free-text';
      case 'yellow':
        return 'bg-[#FDFAB0] text-feel-soso-text';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  // 특정 감정을 선택했을 경우 나머지 버튼 (비활성화된 상태)
  const getUnselectedColor = () => 'bg-gray-100 text-gray-500';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-[80px] w-[85px] flex-shrink-0 flex-col items-center justify-center gap-[4px] rounded-2xl text-xs font-semibold sm:h-[94px] sm:w-[106px] sm:gap-[6px] sm:text-sm',
        disabled && 'cursor-not-allowed opacity-60',
        selected ? getBaseColor(color) : getUnselectedColor()
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
