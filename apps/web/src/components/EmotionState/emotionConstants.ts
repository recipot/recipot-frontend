import type { EmotionColor } from './EmotionState';

// 감정 옵션 상수
export const EMOTION_OPTIONS = {
  mood: [
    { color: 'blue' as const, label: '힘들어', mood: 'bad' as const },
    { color: 'yellow' as const, label: '그럭저럭', mood: 'neutral' as const },
    { color: 'red' as const, label: '충분해', mood: 'good' as const },
  ],
  review: [
    { color: 'blue' as const, feeling: 'bad' as const, label: '별로예요' },
    {
      color: 'yellow' as const,
      feeling: 'soso' as const,
      label: '그저 그래요',
    },
    { color: 'red' as const, feeling: 'good' as const, label: '또 해먹을래요' },
  ],
} as const;

// 공통 transition 설정
const TRANSITIONS = {
  fast: { duration: 0.2, ease: 'easeOut' as const },
  slow: { duration: 0.3, ease: 'easeOut' as const },
  tap: { duration: 0.1, ease: 'easeIn' as const },
} as const;

// 애니메이션 variants
export const EMOTION_ANIMATION_VARIANTS = {
  moodCircle: {
    initial: { borderRadius: 100, scale: 1 },
    selected: {
      borderRadius: 126,
      transition: TRANSITIONS.slow,
    },
    unselected: {
      borderRadius: 30,
      scale: 1,
      transition: TRANSITIONS.slow,
    },
  },
} as const;

// 아이콘 오프셋 설정
export const getIconOffset = (color: EmotionColor, isSelected: boolean) => {
  switch (color) {
    case 'blue':
      return isSelected ? { x: -9, y: -9 } : { x: -3, y: -3 };
    case 'red':
      return isSelected ? { x: -9, y: -9 } : { x: -3, y: -3 };
    case 'yellow':
      return isSelected ? { x: 0, y: -9 } : { x: 0, y: 0 };
  }
};
