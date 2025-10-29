// 타입 export
export type { EmotionContainerProps } from './EmotionContainer';
export type { FeelingPillProps } from './EmotionOptionButton';
export type { EmotionColor, MoodState, MoodType } from './EmotionState';

// 상수 export
export {
  EMOTION_ANIMATION_VARIANTS,
  EMOTION_OPTIONS,
} from './emotionConstants';

// 컴포넌트 export (새로운 구조)
export { default as EmotionBackground } from './EmotionBackground';
export { default as EmotionCharacter } from './EmotionCharacter/EmotionCharacter';
export { default as EmotionContainer } from './EmotionContainer';
export { default as EmotionSelector } from './EmotionSelector';

// 하위 컴포넌트 export (필요 시)
export { default as EmotionOptionButton } from './EmotionOptionButton';

// 레거시 지원 (기존 코드 호환성을 위해 EmotionState를 EmotionContainer로 re-export)
export { default } from './EmotionState';

// 유틸리티 함수 export
export {
  calculateLevel,
  getCharacterImage,
} from './EmotionCharacter/characterImageSelector';
export { generateCharacterMessage } from './EmotionCharacter/characterMessageGenerator';
