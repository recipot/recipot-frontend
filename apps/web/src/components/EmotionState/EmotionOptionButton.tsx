import React from 'react';
import { motion } from 'framer-motion';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';
import { cn } from '@/lib/utils';
import type { EmotionColor } from '@/types/emotion.types';

import MoodVariantButton from './MoodVariantButton';

import type { Variants } from 'framer-motion';

// 정적 애니메이션 variants - 컴포넌트 외부로 이동
const BUTTON_VARIANTS: Variants = {
  hover: { scale: 1.05 },
  initial: { scale: 1 },
  tap: { scale: 0.95 },
};

const ICON_VARIANTS: Variants = {
  initial: { scale: 1 },
  selected: { scale: 1.1 },
  unselected: { scale: 1 },
};

const TEXT_VARIANTS: Variants = {
  initial: { opacity: 1, scale: 1 },
  selected: { opacity: 1, scale: 1.05 },
  unselected: { opacity: 1, scale: 1 },
};

// 헬퍼 함수들을 컴포넌트 내부로 통합
const getBaseColor = (color: EmotionColor, variant: string): string => {
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

const getIconColor = (
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

const getSizeClasses = (size: string) => {
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

const getVariantClasses = (variant: string) => {
  const variantMap = {
    compact: 'rounded-2xl',
    default: 'rounded-2xl',
    mood: 'rounded-none',
    pill: 'rounded-full',
  };
  return variantMap[variant as keyof typeof variantMap] || 'rounded-2xl';
};

const renderIcon = (color: EmotionColor, iconColor: string) => {
  const iconMap = {
    blue: <EmotionBadIcon color={iconColor} />,
    red: <EmotionGoodIcon color={iconColor} />,
    yellow: <EmotionNeutralIcon color={iconColor} />,
  };
  return iconMap[color] || null;
};

export interface FeelingPillProps {
  label: string;
  color: EmotionColor;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'pill' | 'mood';
  enableAnimation?: boolean;
}

function EmotionOptionButton({
  className,
  color,
  disabled,
  enableAnimation = false,
  label,
  onClick,
  selected,
  size = 'md',
  variant = 'default',
}: FeelingPillProps) {
  // 단순한 계산은 직접 호출 - useMemo 불필요
  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);
  const iconColor = getIconColor(color, selected, variant);

  // 애니메이션 컴포넌트 설정
  const ButtonComponent = enableAnimation ? motion.button : 'button';
  const IconComponent = enableAnimation ? motion.span : 'span';
  const TextComponent = enableAnimation ? motion.span : 'span';

  // 애니메이션 props - 조건부로만 생성
  const buttonProps = enableAnimation
    ? {
        initial: 'initial',
        transition: { duration: 0.2 },
        variants: BUTTON_VARIANTS,
        whileHover: !disabled ? 'hover' : 'initial',
        whileTap: !disabled ? 'tap' : 'initial',
      }
    : {};

  const iconProps = enableAnimation
    ? {
        animate: selected ? 'selected' : 'unselected',
        initial: 'initial',
        transition: { delay: selected ? 0.1 : 0, duration: 0.2 },
        variants: ICON_VARIANTS,
      }
    : {};

  const textProps = enableAnimation
    ? {
        animate: selected ? 'selected' : 'unselected',
        initial: 'initial',
        transition: { delay: selected ? 0.1 : 0, duration: 0.2 },
        variants: TEXT_VARIANTS,
      }
    : {};

  // mood variant는 별도 컴포넌트로 처리
  if (variant === 'mood') {
    return (
      <MoodVariantButton
        color={color}
        selected={selected}
        disabled={disabled}
        onClick={onClick}
        label={label}
        className={className}
      />
    );
  }

  // 기본 variant 렌더링
  return (
    <ButtonComponent
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-shrink-0 flex-col items-center justify-center font-semibold',
        sizeClasses.container,
        variantClasses,
        disabled && 'cursor-not-allowed opacity-60',
        selected === false
          ? 'bg-gray-100 text-gray-500'
          : getBaseColor(color, variant),
        className
      )}
      aria-pressed={!!selected}
      {...buttonProps}
    >
      <IconComponent
        className={cn('leading-none', sizeClasses.icon)}
        {...iconProps}
      >
        {renderIcon(color, iconColor)}
      </IconComponent>
      <TextComponent
        className={cn('font-semibold', sizeClasses.text)}
        {...textProps}
      >
        {label}
      </TextComponent>
    </ButtonComponent>
  );
}

export default EmotionOptionButton;
