import React, { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';

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
    </motion.div>
  );
};

export default EmotionState;
