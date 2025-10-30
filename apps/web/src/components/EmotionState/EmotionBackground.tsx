import '../EmotionState/styles.css';

import { cn } from '@/lib/utils';

import type { MoodType } from './index';

/**
 * mood에 따른 그라디언트 클래스 매핑
 */
const GRADIENT_MAP: Record<MoodType, string> = {
  bad: 'emotion-gradient-bad',
  default: 'emotion-gradient-default',
  good: 'emotion-gradient-good',
  neutral: 'emotion-gradient-neutral',
};

interface EmotionBackgroundProps {
  mood: MoodType | null;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 감정 상태에 따른 배경 그라디언트 컴포넌트
 * mood에 따라 다른 그라디언트 색상을 표시합니다.
 */
export default function EmotionBackground({
  children,
  className,
  mood,
}: EmotionBackgroundProps) {
  // 초기 상태일 때 기본 그래디언트 적용
  const gradientClass =
    /* eslint-disable-next-line security/detect-object-injection */
    mood === null ? GRADIENT_MAP.default : GRADIENT_MAP[mood];

  return (
    <div className={cn('h-full w-full', gradientClass, className)}>
      {children}
    </div>
  );
}
