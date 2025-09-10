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

// 아이콘 색상 상수 (opacity별)
const ICON_COLORS = {
  blue: {
    low: 'rgba(59, 130, 246, 0.3)',
    medium: 'rgba(59, 130, 246, 0.6)',
  },
  red: {
    low: 'rgba(239, 68, 68, 0.3)',
    medium: 'rgba(239, 68, 68, 0.6)',
  },
  yellow: {
    low: 'rgba(234, 179, 8, 0.3)',
    medium: 'rgba(234, 179, 8, 0.6)',
  },
} as const;

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
  const config = COLOR_CONFIG[color];
  if (!config) return 'bg-gray-100 text-gray-500';

  return variant === 'mood' ? config.mood : config.base;
};

export const getIconColor = (
  color: EmotionColor,
  selected: boolean | undefined,
  variant: string
) => {
  // 초기 상태 (아무것도 선택되지 않은 상태) - 더 진한 색상
  if (selected === undefined) {
    return ICON_COLORS[color]?.medium || '#9CA3AF';
  }

  // 선택되지 않은 상태 (다른 감정이 선택된 상태) - 더 연한 색상
  if (selected === false) {
    return ICON_COLORS[color]?.low || '#adb5bd';
  }

  // 선택된 상태
  const config = COLOR_CONFIG[color];
  if (!config) return '#9CA3AF';

  return variant === 'mood' ? config.iconMood : config.icon;
};

export const getVariantClasses = (variant: string) => {
  if (variant === 'mood') return VARIANT_CONFIG.mood;
  return VARIANT_CONFIG.default;
};

export const renderIcon = (color: EmotionColor, iconColor: string) => {
  const config = COLOR_CONFIG[color];
  if (!config) return null;

  const IconComponent = config.component;
  return <IconComponent color={iconColor} />;
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

  // 선택되지 않은 상태는 모든 색상이 동일
  if (selected === false) {
    return UNSELECTED_COLOR;
  }

  // 선택된 상태 또는 초기 상태
  return activeColors[color] || activeColors.blue;
};
