import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { getMoodColors, renderIcon } from './emotionButtonHelpers';
import { EMOTION_ANIMATION_VARIANTS, getIconOffset } from './emotionConstants';

import type { EmotionColor } from './EmotionState';

interface MoodVariantButtonProps {
  color: EmotionColor;
  selected: boolean | undefined;
  onClick?: () => void;
  label: string;
  className?: string;
}

// 색상 및 스타일 헬퍼 함수들

const MoodVariantButton: React.FC<MoodVariantButtonProps> = ({
  className,
  color,
  label,
  onClick,
  selected,
}) => {
  const isSelected = selected === true;
  const colors = getMoodColors(color, selected);
  const offset = getIconOffset(color, isSelected);

  const moodIconVariants = useMemo(
    () => ({
      ...EMOTION_ANIMATION_VARIANTS.moodIcon,
      initial: {
        ...EMOTION_ANIMATION_VARIANTS.moodIcon.initial,
        x: offset.x,
        y: offset.y,
      },
      selected: {
        ...EMOTION_ANIMATION_VARIANTS.moodIcon.selected,
        x: offset.x,
        y: offset.y,
      },
      unselected: {
        ...EMOTION_ANIMATION_VARIANTS.moodIcon.unselected,
        x: offset.x,
        y: offset.y,
      },
    }),
    [offset.x, offset.y]
  );

  const circleStyle = useMemo(
    () => ({
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: isSelected ? 1.26 : 1,
      height: isSelected ? 72 : 60, // xs: 76/64, sm: 80/68, md: 88/76, lg: 96/84
      opacity: 0.95,
      padding: 15,
      width: isSelected ? 72 : 60, // xs: 76/64, sm: 80/68, md: 88/76, lg: 96/84
    }),
    [colors.bg, colors.border, isSelected]
  );

  const textStyle = useMemo(() => ({ color: colors.text }), [colors.text]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn('flex flex-col items-center space-y-2', className)}
      aria-pressed={!!selected}
      variants={EMOTION_ANIMATION_VARIANTS.button}
      initial="initial"
    >
      <motion.div
        className="flex items-center justify-center rounded-full border"
        style={circleStyle}
        variants={EMOTION_ANIMATION_VARIANTS.moodCircle}
        initial="initial"
        animate={isSelected ? 'selected' : 'unselected'}
      >
        <motion.div
          className="relative"
          variants={moodIconVariants}
          initial="initial"
          animate={isSelected ? 'selected' : 'unselected'}
        >
          {renderIcon(color, colors.icon)}
        </motion.div>
      </motion.div>
      <motion.span
        className="xs:text-base mt-[6px] text-sm sm:text-lg md:text-xl"
        style={textStyle}
        initial="initial"
        animate={isSelected ? 'selected' : 'unselected'}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default MoodVariantButton;
