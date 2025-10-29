'use client';

import EmotionContainer, {
  type EmotionContainerProps,
} from './EmotionContainer';

export type MoodType = 'bad' | 'neutral' | 'good' | 'default';
export type MoodState = 'default' | 'selected' | 'disabled';
export type EmotionColor = 'blue' | 'yellow' | 'red';

/**
 * @deprecated
 * 레거시 EmotionState 컴포넌트입니다.
 * 이제 EmotionContainer를 사용하는 것을 권장합니다.
 * 기존 코드 호환성을 위해 EmotionContainer를 래핑하여 제공합니다.
 */
const EmotionState: React.FC<EmotionContainerProps> = props => {
  return <EmotionContainer {...props} />;
};

export default EmotionState;
