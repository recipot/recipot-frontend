import './styles.css';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EMOTION_ANIMATION_VARIANTS } from './emotionConstants';
import {
  getIconOffset,
  getMoodColors,
  getShadowClass,
  renderIcon,
} from './emotionHelpers';

import type { EmotionColor } from './EmotionState';

// ============================================================================
// 타입 정의
// ============================================================================

interface MoodVariantButtonProps {
  color: EmotionColor;
  selected: boolean | undefined;
  onClick?: () => void;
  label: string;
  className?: string;
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

/**
 * 원형 애니메이션이 적용된 무드 선택 버튼 컴포넌트
 * Framer Motion을 사용하여 부드러운 전환 효과를 제공합니다.
 */
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

  // 아이콘 애니메이션 variants
  const moodIconVariants = useMemo(
    () => ({
      selected: { x: offset.x, y: offset.y },
    }),
    [offset.x, offset.y]
  );

  // 원형 버튼 스타일
  const circleStyle = useMemo(
    () => ({
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: isSelected ? 1.26 : 1,
      height: isSelected ? 72 : 60,
      opacity: 0.95,
      padding: 15,
      width: isSelected ? 72 : 60,
    }),
    [colors.bg, colors.border, isSelected]
  );

  // 텍스트 스타일
  const textStyle = useMemo(() => ({ color: colors.text }), [colors.text]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn('flex flex-col items-center space-y-2', className)}
      aria-pressed={!!selected}
      initial="initial"
    >
      {/* 원형 아이콘 컨테이너 */}
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-full border',
          getShadowClass(color, selected)
        )}
        style={circleStyle}
        variants={EMOTION_ANIMATION_VARIANTS.moodCircle}
        initial="initial"
        animate={isSelected ? 'selected' : 'unselected'}
      >
        {/* 아이콘 */}
        <motion.div
          className="relative"
          variants={moodIconVariants}
          initial="initial"
          animate={isSelected ? 'selected' : 'unselected'}
        >
          {renderIcon(color, colors.icon)}
        </motion.div>
      </motion.div>

      {/* 라벨 텍스트 */}
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
