import React from 'react';
import { motion } from 'framer-motion';

import {
  EmotionBadIcon,
  EmotionGoodIcon,
  EmotionNeutralIcon,
} from '@/components/Icons';
import { cn } from '@/lib/utils';
import type { EmotionColor } from '@/types/emotion.types';

import type { Variants } from 'framer-motion';

const BUTTON_VARIANTS: Variants = {
  hover: { scale: 1.05 },
  initial: { scale: 1 },
  tap: { scale: 0.95 },
};

const renderIcon = (color: EmotionColor, iconColor: string) => {
  const iconMap = {
    blue: <EmotionBadIcon color={iconColor} />,
    red: <EmotionGoodIcon color={iconColor} />,
    yellow: <EmotionNeutralIcon color={iconColor} />,
  };
  return iconMap[color] || null;
};

interface MoodVariantButtonProps {
  color: EmotionColor;
  selected: boolean | undefined;
  disabled: boolean | undefined;
  onClick?: () => void;
  label: string;
  className?: string;
}

const MoodVariantButton: React.FC<MoodVariantButtonProps> = ({
  className,
  color,
  disabled,
  label,
  onClick,
  selected,
}) => {
  const isSelected = selected === true;
  const isDisabled = disabled ?? selected === false;

  const moodColors = {
    blue: {
      bg: isSelected ? '#d4e2ff' : '#f8f9fa',
      border: isSelected ? '#4164ae' : '#e9ecef',
      icon: isSelected ? '#4164ae' : '#adb5bd',
      text: isSelected ? '#4164ae' : '#6c757d',
    },
    red: {
      bg: isSelected ? '#ffe0e1' : '#f8f9fa',
      border: isSelected ? '#df6567' : '#e9ecef',
      icon: isSelected ? '#df6567' : '#adb5bd',
      text: isSelected ? '#df6567' : '#6c757d',
    },
    yellow: {
      bg: isSelected ? '#fdfab0' : '#f8f9fa',
      border: isSelected ? '#ad7e06' : '#e9ecef',
      icon: isSelected ? '#ad7e06' : '#adb5bd',
      text: isSelected ? '#ad7e06' : '#6c757d',
    },
  };

  const colors = moodColors[color] || moodColors.blue;

  const circleStyle = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    height: isSelected ? 72 : 60,
    marginBottom: 8,
    opacity: 0.95,
    width: isSelected ? 72 : 60,
  };

  const textStyle = {
    color: colors.text,
  };

  const getIconOffset = () => {
    const offsetMap = {
      blue: isSelected ? { x: -9, y: -9 } : { x: -3, y: -3 },
      red: isSelected ? { x: -9, y: -9 } : { x: -3, y: -3 },
      yellow: isSelected ? { x: 0, y: -9 } : { x: 0, y: 0 },
    };
    return offsetMap[color] || { x: -9, y: -9 };
  };

  const offset = getIconOffset();

  const moodIconVariants: Variants = {
    initial: { scale: 1, x: offset.x, y: offset.y },
    selected: { scale: 1.1, x: offset.x, y: offset.y },
    unselected: { scale: 1, x: offset.x, y: offset.y },
  };

  const moodCircleVariants: Variants = {
    initial: { borderRadius: isSelected ? 36 : 30, scale: 1 },
    selected: { borderRadius: 36, scale: 1.2 },
    unselected: { borderRadius: 30, scale: 1 },
  };

  const moodTextVariants: Variants = {
    initial: { opacity: 1 },
    selected: { opacity: 1, scale: 1.05 },
    unselected: { opacity: 1, scale: 1 },
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'flex flex-col items-center space-y-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      aria-pressed={!!selected}
      variants={BUTTON_VARIANTS}
      initial="initial"
      whileHover={!isDisabled ? 'hover' : 'initial'}
      whileTap={!isDisabled ? 'tap' : 'initial'}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border"
        style={circleStyle}
        variants={moodCircleVariants}
        initial="initial"
        animate={isSelected ? 'selected' : 'unselected'}
        transition={{
          damping: 20,
          duration: 0.3,
          stiffness: 300,
          type: 'spring' as const,
        }}
      >
        <motion.div
          className="relative"
          variants={moodIconVariants}
          initial="initial"
          animate={isSelected ? 'selected' : 'unselected'}
          transition={{ delay: isSelected ? 0.1 : 0, duration: 0.2 }}
        >
          {renderIcon(color, colors.icon)}
        </motion.div>
      </motion.div>
      <motion.span
        className="text-sm font-semibold"
        style={textStyle}
        variants={moodTextVariants}
        initial="initial"
        animate={isSelected ? 'selected' : 'unselected'}
        transition={{ delay: isSelected ? 0.1 : 0, duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default MoodVariantButton;
