import React from 'react';

import { cn } from '@/lib/utils';

import { EmotionBadIcon, EmotionGoodIcon, EmotionNeutralIcon } from '../Icons';

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
  // 선택된 버튼의 색상 (원래 색상) - 실제 디자인에 맞게 수정
  const getBaseColor = (color: FeelingPillProps['color']): string => {
    switch (color) {
      case 'blue':
        return 'bg-[#D4E2FF] text-feel-tired-text';
      case 'red':
        return 'bg-[#FFE0E1] text-feel-free-text';
      case 'yellow':
        return 'bg-[#FDFAB0] text-feel-soso-text';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  // 특정 감정을 선택했을 경우 나머지 버튼 (비활성화된 상태)
  const getUnselectedColor = () => 'bg-gray-100 text-gray-500';

  // 기본 variant 렌더링
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'xs:h-[80px] xs:w-[85px] flex h-[93px] w-[106px] flex-shrink-0 flex-col items-center justify-center gap-[6px] rounded-2xl text-sm font-semibold',
        disabled && 'cursor-not-allowed opacity-60',
        selected === false ? getUnselectedColor() : getBaseColor(color)
      )}
      aria-pressed={!!selected}
    >
      <span className="xs:text-xl text-2xl leading-none">
        {color === 'blue' && (
          <EmotionBadIcon color={selected === false ? '#9CA3AF' : '#4164ae'} />
        )}
        {color === 'yellow' && (
          <EmotionNeutralIcon
            color={selected === false ? '#9CA3AF' : '#ad7e06'}
          />
        )}
        {color === 'red' && (
          <EmotionGoodIcon color={selected === false ? '#9CA3AF' : '#df6567'} />
        )}
      </span>
      <span className="text-15sb xs:text-13sb">{label}</span>
    </button>
  );
}

export default EmotionOptionButton;
