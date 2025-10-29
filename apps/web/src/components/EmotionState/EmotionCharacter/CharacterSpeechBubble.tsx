import { useEffect } from 'react';

import { useTypingEffect } from '@/hooks';
import { cn } from '@/lib/utils';

import type { MoodType } from '../index';

/**
 * 말풍선 스타일 정의
 */
const SPEECH_BUBBLE_STYLES = {
  bad: {
    arrow: 'after:border-t-[hsl(var(--feel-back-tired))]',
    bg: 'bg-feel-back-tired',
    text: 'text-feel-tired-text',
  },
  default: {
    arrow: 'after:border-t-[hsl(var(--feel-back-default))]',
    bg: 'bg-feel-back-default',
    text: 'text-primary',
  },
  good: {
    arrow: 'after:border-t-[hsl(var(--feel-back-free))]',
    bg: 'bg-feel-back-free',
    text: 'text-feel-free-text',
  },
  neutral: {
    arrow: 'after:border-t-[hsl(var(--feel-back-soso))]',
    bg: 'bg-feel-back-soso',
    text: 'text-feel-soso-text',
  },
} as const;

interface CharacterSpeechBubbleProps {
  mood: MoodType;
  message: string;
  onTypingComplete?: () => void;
}

/**
 * 캐릭터의 말풍선 컴포넌트
 * 타이핑 효과와 함께 메시지를 표시합니다.
 */
export default function CharacterSpeechBubble({
  message,
  mood,
  onTypingComplete,
}: CharacterSpeechBubbleProps) {
  /* eslint-disable-next-line security/detect-object-injection */
  const styles = SPEECH_BUBBLE_STYLES[mood];

  // 타이핑 효과 적용
  const { displayedText, isComplete } = useTypingEffect(message, {
    delay: 300,
    speed: 30,
  });

  // 타이핑 완료 시 콜백 호출
  useEffect(() => {
    if (isComplete && onTypingComplete) {
      onTypingComplete();
    }
  }, [isComplete, onTypingComplete]);

  // 숫자를 bold 처리한 JSX 반환
  const renderMessageWithBold = (text: string) => {
    // 숫자 뒤에 "번"이 오는 패턴을 찾아 bold 처리
    const parts = text.split(/(\d+번)/g);

    return parts.map((part, index) => {
      // 숫자+번 패턴이면 bold 처리
      if (/\d+번/.test(part)) {
        const number = part.replace('번', '');
        return (
          <span key={index}>
            <span className="font-bold">{number}</span>번
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-[10px] flex h-[100px] w-full items-center justify-center">
      <div
        className={cn(
          'relative rounded-[80px] px-6 py-4',
          "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[10px] after:border-transparent after:content-['']",
          styles.bg,
          styles.arrow
        )}
      >
        <p
          className={cn('text-17 text-center whitespace-pre-line', styles.text)}
        >
          {renderMessageWithBold(displayedText)}
        </p>
      </div>
    </div>
  );
}
