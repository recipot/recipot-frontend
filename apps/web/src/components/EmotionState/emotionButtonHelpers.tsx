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
  if (selected === false) return '#adb5bd';

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
export const getMoodColors = (color: EmotionColor, isSelected: boolean) => {
  const selectedColors = {
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

  const unselectedColors = {
    bg: 'hsl(var(--gray-50))',
    border: 'hsl(var(--gray-200))',
    icon: 'hsl(var(--gray-500))',
    text: 'hsl(var(--gray-600))',
  };

  if (color === 'blue') {
    return isSelected ? selectedColors.blue : unselectedColors;
  }
  if (color === 'red') {
    return isSelected ? selectedColors.red : unselectedColors;
  }
  if (color === 'yellow') {
    return isSelected ? selectedColors.yellow : unselectedColors;
  }
  return isSelected ? selectedColors.blue : unselectedColors;
};
