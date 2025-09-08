import React from 'react';

import { cn } from '@/lib/utils';

import { EmotionBadIcon, EmotionGoodIcon, EmotionNeutralIcon } from '../Icons';

import { getBaseColor } from './emotionButtonHelpers';
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

  // 단순한 계산은 직접 호출

  // 특정 감정을 선택했을 경우 나머지 버튼 (비활성화된 상태)
  const getUnselectedColor = () => 'bg-gray-100 text-gray-500';

  // 기본 variant 렌더링
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[80px] w-[85px] flex-shrink-0 flex-col items-center justify-center gap-[4px] rounded-2xl text-xs font-semibold sm:h-[94px] sm:w-[106px] sm:gap-[6px] sm:text-sm',

        selected === false ? getUnselectedColor() : getBaseColor(color, variant)
      )}
      aria-pressed={!!selected}
    >
      <span className="text-xl leading-none sm:text-2xl">
        {color === 'blue' && (
          <EmotionBadIcon
            color={
              selected === false ? '#9CA3AF' : 'hsl(var(--feel-tired-text))'
            }
          />
        )}
        {color === 'yellow' && (
          <EmotionNeutralIcon
            color={
              selected === false ? '#9CA3AF' : 'hsl(var(--feel-soso-text))'
            }
          />
        )}
        {color === 'red' && (
          <EmotionGoodIcon
            color={
              selected === false ? '#9CA3AF' : 'hsl(var(--feel-free-text))'
            }
          />
        )}
      </span>
      <span className="xs:text-12sb text-15sb">{label}</span>
    </button>
  );
}

export default EmotionOptionButton;
