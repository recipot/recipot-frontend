import React from 'react';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';

import type { EmotionColor } from './EmotionState';

// ============================================================================
// 색상 설정
// ============================================================================

/**
 * 감정별 색상 및 아이콘 매핑
 */
const EMOTION_CONFIG = {
  blue: {
    bg: 'hsl(var(--feel-back-tired))',
    component: EmotionBadIcon,
    shadow: 'emotion-shadow-bad',
    text: 'hsl(var(--feel-tired-text))',
  },
  red: {
    bg: 'hsl(var(--feel-back-free))',
    component: EmotionGoodIcon,
    shadow: 'emotion-shadow-good',
    text: 'hsl(var(--feel-free-text))',
  },
  yellow: {
    bg: 'hsl(var(--feel-back-soso))',
    component: EmotionNeutralIcon,
    shadow: 'emotion-shadow-neutral',
    text: 'hsl(var(--feel-soso-text))',
  },
} as const;

/**
 * 선택되지 않은 상태의 회색 색상
 */
const UNSELECTED_COLORS = {
  bg: 'hsl(var(--gray-100))',
  border: 'hsl(var(--gray-600))',
  icon: 'hsl(var(--gray-600))',
  text: 'hsl(var(--gray-700))',
} as const;

// ============================================================================
// 유틸리티 함수들
// ============================================================================

/**
 * CSS 변수에서 클래스명 추출
 */
const extractCssVar = (cssVar: string) =>
  cssVar.replace('hsl(var(', '').replace('))', '');

/**
 * 아이콘 오프셋 계산
 */
export const getIconOffset = (color: EmotionColor, isSelected: boolean) => {
  if (color === 'yellow') {
    return isSelected ? { x: 0, y: -9 } : { x: 0, y: 0 };
  }
  return isSelected ? { x: -9, y: -9 } : { x: -3, y: -3 };
};

/**
 * 그림자 클래스 반환
 */
export const getShadowClass = (color: EmotionColor, selected?: boolean) => {
  return selected ? EMOTION_CONFIG[color]?.shadow || '' : '';
};

/**
 * 아이콘 렌더링
 */
export const renderIcon = (color: EmotionColor, iconColor: string) => {
  const Component = EMOTION_CONFIG[color]?.component;
  return Component
    ? React.createElement(Component, { color: iconColor })
    : null;
};

/**
 * MoodVariantButton용 색상 반환
 */
export const getMoodColors = (
  color: EmotionColor,
  selected: boolean | undefined
) => {
  if (selected === false) return UNSELECTED_COLORS;

  const config = EMOTION_CONFIG[color];
  if (!config) return UNSELECTED_COLORS;

  return {
    bg: config.bg,
    border: config.text,
    icon: config.text,
    text: config.text,
  };
};

/**
 * EmotionOptionButton용 색상 클래스 반환
 */
export const getBaseColor = (color: EmotionColor, variant: string) => {
  const config = EMOTION_CONFIG[color];
  if (!config) return 'bg-gray-100 text-gray-500';

  if (variant === 'mood') {
    return extractCssVar(config.text);
  }

  return `${extractCssVar(config.bg)} ${extractCssVar(config.text)}`;
};

/**
 * 아이콘 색상 반환
 */
export const getIconColor = (
  color: EmotionColor,
  selected: boolean | undefined
) => {
  const config = EMOTION_CONFIG[color];
  if (!config) return '#9CA3AF';

  // 선택된 상태
  if (selected === true) return config.text;

  // 투명도 색상 매핑
  const opacityColors = {
    blue:
      selected === undefined
        ? 'rgba(59, 130, 246, 0.6)'
        : 'rgba(59, 130, 246, 0.3)',
    red:
      selected === undefined
        ? 'rgba(239, 68, 68, 0.6)'
        : 'rgba(239, 68, 68, 0.3)',
    yellow:
      selected === undefined
        ? 'rgba(234, 179, 8, 0.6)'
        : 'rgba(234, 179, 8, 0.3)',
  };

  return opacityColors[color] || '#9CA3AF';
};
