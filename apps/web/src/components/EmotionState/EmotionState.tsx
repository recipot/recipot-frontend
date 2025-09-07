import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

import { MOOD_LABELS } from '../../types/emotion.types';
import EmotionOptionButton from './EmotionOptionButton';

import type { MoodState, MoodType } from '../../types/emotion.types';

interface EmotionStateProps {
  onMoodChange?: (mood: MoodType | null) => void;
  initialMood?: MoodType | null;
  disabled?: boolean;
  className?: string;
}

const EmotionState: React.FC<EmotionStateProps> = ({
  className = '',
  disabled = false,
  initialMood = null,
  onMoodChange,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood
  );

  const handleMoodClick = (mood: MoodType) => {
    if (disabled) return;

    const newMood = selectedMood === mood ? null : mood;
    setSelectedMood(newMood);
    onMoodChange?.(newMood);
  };

  const getMoodState = (mood: MoodType): MoodState => {
    if (disabled) return 'disabled';
    if (selectedMood === mood) return 'selected';
    return 'default';
  };

  // 애니메이션 variants
  const containerVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    []
  );

  const rowVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  const titleVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  const transitionConfig = useMemo(
    () => ({
      delayChildren: 0.2,
      staggerChildren: 0.1,
    }),
    []
  );

  const titleTransition = useMemo(
    () => ({
      duration: 0.6,
    }),
    []
  );

  const rowTransition = useMemo(
    () => ({
      duration: 0.5,
    }),
    []
  );

  const exitTransition = useMemo(
    () => ({
      duration: 0.3,
      ease: 'easeOut' as const,
    }),
    []
  );

  const initialAnimation = useMemo(
    () => ({
      opacity: 0,
      scale: 0.8,
      y: 20,
    }),
    []
  );

  const animateAnimation = useMemo(
    () => ({
      opacity: 1,
      scale: 1,
      y: 0,
    }),
    []
  );

  const exitAnimation = useMemo(
    () => ({
      opacity: 0,
      scale: 0.8,
      y: -20,
    }),
    []
  );

  return (
    <motion.div
      className={`flex flex-col items-center space-y-8 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={transitionConfig}
    >
      <motion.h2
        className="mb-4 text-2xl font-bold text-gray-800"
        variants={titleVariants}
        transition={titleTransition}
      >
        감정 상태 컴포넌트
      </motion.h2>

      {/* Default States Row */}
      <motion.div
        className="flex space-x-8"
        variants={rowVariants}
        transition={rowTransition}
      >
        <EmotionOptionButton
          label="힘들어"
          color="blue"
          selected={getMoodState('bad') === 'selected'}
          disabled={disabled}
          onClick={() => handleMoodClick('bad')}
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="그럭저럭"
          color="yellow"
          selected={getMoodState('neutral') === 'selected'}
          disabled={disabled}
          onClick={() => handleMoodClick('neutral')}
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="충분해"
          color="red"
          selected={getMoodState('good') === 'selected'}
          disabled={disabled}
          onClick={() => handleMoodClick('good')}
          variant="mood"
          enableAnimation
        />
      </motion.div>

      {/* Selected States Row */}
      <motion.div
        className="flex space-x-8"
        variants={rowVariants}
        transition={rowTransition}
      >
        <EmotionOptionButton
          label="힘들어"
          color="blue"
          selected
          disabled
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="그럭저럭"
          color="yellow"
          disabled
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="충분해"
          color="red"
          disabled
          variant="mood"
          enableAnimation
        />
      </motion.div>

      {/* Disabled States Row */}
      <motion.div
        className="flex space-x-8"
        variants={rowVariants}
        transition={rowTransition}
      >
        <EmotionOptionButton
          label="힘들어"
          color="blue"
          disabled
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="그럭저럭"
          color="yellow"
          selected
          disabled
          variant="mood"
          enableAnimation
        />
        <EmotionOptionButton
          label="충분해"
          color="red"
          selected
          disabled
          variant="mood"
          enableAnimation
        />
      </motion.div>

      {/* Current Selection Display with Animation */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            className="mt-6 rounded-lg bg-gray-100 p-4"
            initial={initialAnimation}
            animate={animateAnimation}
            exit={exitAnimation}
            transition={exitTransition}
          >
            <p className="text-sm text-gray-600">
              선택된 감정:{' '}
              <span className="font-semibold">{MOOD_LABELS[selectedMood]}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmotionState;
