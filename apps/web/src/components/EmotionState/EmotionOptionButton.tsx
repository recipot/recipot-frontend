import React from 'react';

import { cn } from '@/lib/utils';

import { getBaseColor, getIconColor, renderIcon } from './emotionButtonHelpers';
import MoodVariantButton from './MoodVariantButton';

import type { EmotionColor } from './EmotionState';

export interface FeelingPillProps {
  label: string;
  color: EmotionColor;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'mood';
  enableAnimation?: boolean;
}

function EmotionOptionButton({
  className,
  color,
  label,
  onClick,
  selected,
  variant = 'default',
}: FeelingPillProps) {
  // mood variant는 별도 컴포넌트로 처리
  if (variant === 'mood') {
    return (
      <MoodVariantButton
        color={color}
        selected={selected}
        onClick={onClick}
        label={label}
        className={className}
      />
    );
  }

  // 기본 variant 렌더링
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[80px] w-[85px] flex-shrink-0 flex-col items-center justify-center gap-[4px] rounded-2xl text-xs font-semibold sm:h-[94px] sm:w-[106px] sm:gap-[6px] sm:text-sm',

        getBaseColor(color, variant)
      )}
      aria-pressed={!!selected}
    >
      <span className="text-xl leading-none sm:text-2xl">
        {renderIcon(color, getIconColor(color, selected, variant))}
      </span>
      <span className="xs:text-12sb text-15sb">{label}</span>
    </button>
  );
}

export default EmotionOptionButton;
