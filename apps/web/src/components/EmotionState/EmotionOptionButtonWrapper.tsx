import React from 'react';
import { cn } from '@/lib/utils';
import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';

export interface EmotionOptionButtonWrapperProps {
  label: string;
  color: 'blue' | 'yellow' | 'red';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'pill';
}

function EmotionOptionButtonWrapper({
  color,
  disabled,
  label,
  onClick,
  selected,
  className,
  size = 'md',
  variant = 'default',
}: EmotionOptionButtonWrapperProps) {
  // 선택된 버튼의 색상 (원래 색상)
  const getBaseColor = (
    color: EmotionOptionButtonWrapperProps['color']
  ): string => {
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

  // 특정 감정을 선택했을 경우 나머지 버튼 (비활성화된 상태)
  const getUnselectedColor = () => 'bg-gray-100 text-gray-500';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-[80px] w-[85px] gap-[4px] text-xs',
          icon: 'text-xl',
          text: 'text-xs',
        };
      case 'md':
        return {
          container: 'h-[94px] w-[106px] gap-[6px] text-sm',
          icon: 'text-2xl',
          text: 'text-sm',
        };
      case 'lg':
        return {
          container: 'h-[116px] w-[93px] gap-[8px] text-base',
          icon: 'text-3xl',
          text: 'text-base',
        };
      default:
        return {
          container: 'h-[94px] w-[106px] gap-[6px] text-sm',
          icon: 'text-2xl',
          text: 'text-sm',
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'rounded-2xl';
      case 'pill':
        return 'rounded-full';
      case 'default':
      default:
        return 'rounded-2xl';
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  const renderIcon = () => {
    const iconColor =
      selected === false
        ? '#9CA3AF'
        : color === 'blue'
          ? 'hsl(var(--feel-tired-text))'
          : color === 'yellow'
            ? 'hsl(var(--feel-soso-text))'
            : color === 'red'
              ? 'hsl(var(--feel-free-text))'
              : '#9CA3AF';

    switch (color) {
      case 'blue':
        return <EmotionBadIcon color={iconColor} />;
      case 'yellow':
        return <EmotionNeutralIcon color={iconColor} />;
      case 'red':
        return <EmotionGoodIcon color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-shrink-0 flex-col items-center justify-center font-semibold transition-all duration-200',
        sizeClasses.container,
        variantClasses,
        disabled && 'cursor-not-allowed opacity-60',
        !disabled && 'hover:scale-105',
        selected === false ? getUnselectedColor() : getBaseColor(color),
        className
      )}
      aria-pressed={!!selected}
    >
      <span className={cn('leading-none', sizeClasses.icon)}>
        {renderIcon()}
      </span>
      <span className={cn('font-semibold', sizeClasses.text)}>{label}</span>
    </button>
  );
}

export default EmotionOptionButtonWrapper;
