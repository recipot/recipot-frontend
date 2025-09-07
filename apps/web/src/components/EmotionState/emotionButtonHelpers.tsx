import React from 'react';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';
import type { EmotionColor } from '@/types/emotion.types';

// 색상 관련 헬퍼 함수들
export const getBaseColor = (color: EmotionColor, variant: string): string => {
  if (variant === 'mood') {
    switch (color) {
      case 'blue':
        return 'text-[#4164ae]';
      case 'red':
        return 'text-[#df6567]';
      case 'yellow':
        return 'text-[#ad7e06]';
      default:
        return 'text-gray-500';
    }
  }

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

export const getIconColor = (
  color: EmotionColor,
  selected: boolean | undefined,
  variant: string
) => {
  if (selected === false) return '#adb5bd';

  if (variant === 'mood') {
    const moodColors = { blue: '#4164ae', red: '#df6567', yellow: '#ad7e06' };
    return selected ? moodColors[color] : '#adb5bd';
  }

  const defaultColors = {
    blue: 'hsl(var(--feel-tired-text))',
    red: 'hsl(var(--feel-free-text))',
    yellow: 'hsl(var(--feel-soso-text))',
  };
  return defaultColors[color] || '#9CA3AF';
};

// 스타일 클래스 헬퍼 함수들
export const getSizeClasses = (size: string) => {
  const sizeMap = {
    lg: {
      container: 'h-[116px] w-[93px] gap-[8px] text-base',
      icon: 'text-3xl',
      text: 'text-base',
    },
    md: {
      container: 'h-[94px] w-[106px] gap-[6px] text-sm',
      icon: 'text-2xl',
      text: 'text-sm',
    },
    sm: {
      container: 'h-[80px] w-[85px] gap-[4px] text-xs',
      icon: 'text-xl',
      text: 'text-xs',
    },
  };
  return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
};

export const getVariantClasses = (variant: string) => {
  const variantMap = {
    compact: 'rounded-2xl',
    default: 'rounded-2xl',
    mood: 'rounded-none',
    pill: 'rounded-full',
  };
  return variantMap[variant as keyof typeof variantMap] || 'rounded-2xl';
};

// 아이콘 렌더링 헬퍼
export const renderIcon = (color: EmotionColor, iconColor: string) => {
  const iconMap = {
    blue: <EmotionBadIcon color={iconColor} />,
    red: <EmotionGoodIcon color={iconColor} />,
    yellow: <EmotionNeutralIcon color={iconColor} />,
  };
  return iconMap[color] || null;
};
