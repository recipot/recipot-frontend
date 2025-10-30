// ============================================================================
// 타입 export
// ============================================================================
export type { FeelingPillProps } from './EmotionOptionButton';

// MoodType, MoodState, EmotionColor 타입 정의
export type MoodType = 'bad' | 'neutral' | 'good' | 'default';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

// ============================================================================
// 상수 export
// ============================================================================
export {
  EMOTION_ANIMATION_VARIANTS,
  EMOTION_OPTIONS,
} from './emotionConstants';

// ============================================================================
// 컴포넌트 export
// ============================================================================
export { default as EmotionBackground } from './EmotionBackground';
export { default as EmotionCharacter } from './EmotionCharacter/EmotionCharacter';
export { default as EmotionOptionButton } from './EmotionOptionButton';
export { default as EmotionSelector } from './EmotionSelector';

// ============================================================================
// 유틸리티 함수 export
// ============================================================================
export {
  calculateLevel,
  getCharacterImage,
} from './EmotionCharacter/characterImageSelector';
export { generateCharacterMessage } from './EmotionCharacter/characterMessageGenerator';
