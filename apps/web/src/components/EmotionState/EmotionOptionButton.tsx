import './styles.css';

import React from 'react';

import { cn } from '@/lib/utils';

import {
  EMOTION_CONFIG,
  getBaseColor,
  getIconColor,
  renderIcon,
} from './emotionHelpers';
import MoodVariantButton from './MoodVariantButton';

import type { EmotionColor } from './index';

// ============================================================================
// 타입 정의
// ============================================================================

export interface FeelingPillProps {
  label: string;
  color: EmotionColor;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'mood';
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

/**
 * 감정을 선택할 수 있는 옵션 버튼 컴포넌트
 * variant에 따라 다른 스타일과 동작을 제공합니다.
 */
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
  const shadowClass = selected ? EMOTION_CONFIG[color]?.shadow : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[93px] w-[106px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl',
        shadowClass,
        getBaseColor(color, variant)
      )}
      aria-pressed={!!selected}
    >
      {renderIcon(color, getIconColor(color, selected))}
      <span className="text-15sb">{label}</span>
    </button>
  );
}

export default EmotionOptionButton;
