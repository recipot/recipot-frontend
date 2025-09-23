import './styles.css';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { EMOTION_ANIMATION_VARIANTS } from './emotionConstants';
import {
  EMOTION_CONFIG,
  getIconOffset,
  getMoodColors,
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
  color,
  label,
  onClick,
  selected,
}) => {
  const isSelected = selected === true;
  const colors = getMoodColors(color, selected);
  const selectedOffset = getIconOffset(color, true);
  const unselectedOffset = getIconOffset(color, false);

  // 아이콘 애니메이션 variants
  const moodIconVariants = useMemo(
    () => ({
      initial: { x: 0, y: 0 },
      selected: { x: selectedOffset.x, y: selectedOffset.y },
      unselected: { x: unselectedOffset.x, y: unselectedOffset.y },
    }),
    [selectedOffset.x, selectedOffset.y, unselectedOffset.x, unselectedOffset.y]
  );

  // 원형 버튼 스타일
  const circleStyle = useMemo(
    () => ({
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: isSelected ? 1.26 : 1,
      padding: 15,
    }),
    [colors.bg, colors.border, isSelected]
  );

  // 텍스트 스타일
  const textStyle = useMemo(() => ({ color: colors.text }), [colors.text]);

  // 그림자 클래스
  const shadowClass = selected ? EMOTION_CONFIG[color]?.shadow : '';

  // 컨테이너 크기 클래스
  const containerSizeClass = isSelected
    ? 'h-[4.5rem] w-[4.5rem]'
    : 'h-[3.75rem] w-[3.75rem]';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="flex h-[116px] w-[93px] flex-col items-center justify-center"
      aria-pressed={!!selected}
      initial="initial"
    >
      {/* 원형 아이콘 컨테이너 */}
      <motion.div
        className={cn(
          'flex items-center justify-center',
          containerSizeClass,
          shadowClass
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
        className="text-17sb mt-[6px]"
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
