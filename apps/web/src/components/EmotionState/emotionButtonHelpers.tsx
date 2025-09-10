import React from 'react';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';

import type { EmotionColor } from './EmotionState';

// 색상 매핑 상수
const FEEL_COLORS = {
  free: 'hsl(var(--feel-free-text))',
  soso: 'hsl(var(--feel-soso-text))',
  tired: 'hsl(var(--feel-tired-text))',
};

const COLOR_CONFIG = {
  blue: {
    base: 'bg-feel-back-tired text-feel-tired-text',
    component: EmotionBadIcon,
    icon: FEEL_COLORS.tired,
    iconMood: FEEL_COLORS.tired,
    mood: 'text-feel-tired-text',
  },
  red: {
    base: 'bg-feel-back-free text-feel-free-text',
    component: EmotionGoodIcon,
    icon: FEEL_COLORS.free,
    iconMood: FEEL_COLORS.free,
    mood: 'text-feel-free-text',
  },
  yellow: {
    base: 'bg-feel-back-soso text-feel-soso-text',
    component: EmotionNeutralIcon,
    icon: FEEL_COLORS.soso,
    iconMood: FEEL_COLORS.soso,
    mood: 'text-feel-soso-text',
  },
} as const;

// Variant 매핑 상수
const VARIANT_CONFIG = {
  default: 'rounded-2xl',
  mood: 'rounded-none',
} as const;

// 통합된 헬퍼 함수들
export const getBaseColor = (color: EmotionColor, variant: string) => {
  if (color === 'blue') {
    return variant === 'mood' ? COLOR_CONFIG.blue.mood : COLOR_CONFIG.blue.base;
  }
  if (color === 'red') {
    return variant === 'mood' ? COLOR_CONFIG.red.mood : COLOR_CONFIG.red.base;
  }
  if (color === 'yellow') {
    return variant === 'mood'
      ? COLOR_CONFIG.yellow.mood
      : COLOR_CONFIG.yellow.base;
  }
  return 'bg-gray-100 text-gray-500';
};

export const getIconColor = (
  color: EmotionColor,
  selected: boolean | undefined,
  variant: string
) => {
  // 초기 상태 (아무것도 선택되지 않은 상태) - 더 진한 색상
  if (selected === undefined) {
    if (color === 'blue') return 'rgba(59, 130, 246, 0.6)'; // blue with medium opacity
    if (color === 'red') return 'rgba(239, 68, 68, 0.6)'; // red with medium opacity
    if (color === 'yellow') return 'rgba(234, 179, 8, 0.6)'; // yellow with medium opacity
    return '#9CA3AF';
  }

  // 선택되지 않은 상태 (다른 감정이 선택된 상태) - 더 연한 색상
  if (selected === false) {
    if (color === 'blue') return 'rgba(59, 130, 246, 0.3)'; // blue with low opacity
    if (color === 'red') return 'rgba(239, 68, 68, 0.3)'; // red with low opacity
    if (color === 'yellow') return 'rgba(234, 179, 8, 0.3)'; // yellow with low opacity
    return '#adb5bd';
  }

  // 선택된 상태
  if (color === 'blue') {
    return variant === 'mood' && selected
      ? COLOR_CONFIG.blue.iconMood
      : COLOR_CONFIG.blue.icon;
  }
  if (color === 'red') {
    return variant === 'mood' && selected
      ? COLOR_CONFIG.red.iconMood
      : COLOR_CONFIG.red.icon;
  }
  if (color === 'yellow') {
    return variant === 'mood' && selected
      ? COLOR_CONFIG.yellow.iconMood
      : COLOR_CONFIG.yellow.icon;
  }
  return '#9CA3AF';
};

export const getVariantClasses = (variant: string) => {
  if (variant === 'mood') return VARIANT_CONFIG.mood;
  return VARIANT_CONFIG.default;
};

export const renderIcon = (color: EmotionColor, iconColor: string) => {
  if (color === 'blue') {
    const IconComponent = COLOR_CONFIG.blue.component;
    return <IconComponent color={iconColor} />;
  }
  if (color === 'red') {
    const IconComponent = COLOR_CONFIG.red.component;
    return <IconComponent color={iconColor} />;
  }
  if (color === 'yellow') {
    const IconComponent = COLOR_CONFIG.yellow.component;
    return <IconComponent color={iconColor} />;
  }
  return null;
};

// MoodVariantButton용 통합 색상 함수
export const getMoodColors = (
  color: EmotionColor,
  selected: boolean | undefined
) => {
  // 선택된 상태와 초기 상태가 동일한 색상 사용
  const activeColors = {
    blue: {
      bg: 'hsl(var(--feel-back-tired))',
      border: FEEL_COLORS.tired,
      icon: FEEL_COLORS.tired,
      text: FEEL_COLORS.tired,
    },
    red: {
      bg: 'hsl(var(--feel-back-free))',
      border: FEEL_COLORS.free,
      icon: FEEL_COLORS.free,
      text: FEEL_COLORS.free,
    },
    yellow: {
      bg: 'hsl(var(--feel-back-soso))',
      border: FEEL_COLORS.soso,
      icon: FEEL_COLORS.soso,
      text: FEEL_COLORS.soso,
    },
  };

  const UNSELECTED_COLOR = {
    bg: 'hsl(var(--gray-100))',
    border: 'hsl(var(--gray-600))',
    icon: 'hsl(var(--gray-600))',
    text: 'hsl(var(--gray-700))',
  };

  const unselectedColors = {
    blue: UNSELECTED_COLOR,
    red: UNSELECTED_COLOR,
    yellow: UNSELECTED_COLOR,
  };

  if (color === 'blue') {
    if (selected === true) return activeColors.blue;
    if (selected === false) return unselectedColors.blue;
    return activeColors.blue;
  }
  if (color === 'red') {
    if (selected === true) return activeColors.red;
    if (selected === false) return unselectedColors.red;
    return activeColors.red;
  }
  if (color === 'yellow') {
    if (selected === true) return activeColors.yellow;
    if (selected === false) return unselectedColors.yellow;
    return activeColors.yellow;
  }
  if (selected === true) return activeColors.blue;
  if (selected === false) return unselectedColors.blue;
  return activeColors.blue;
};
