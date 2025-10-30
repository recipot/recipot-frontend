import { useEffect, useState } from 'react';

interface UseTypingEffectOptions {
  /**
   * 타이핑 속도 (밀리초)
   */
  speed?: number;
  /**
   * 타이핑 시작 전 지연 시간 (밀리초)
   */
  delay?: number;
}

/**
 * 텍스트 타이핑 효과를 제공하는 커스텀 훅
 *
 * @param text - 타이핑할 전체 텍스트
 * @param options - 타이핑 옵션 (속도, 지연 시간)
 * @returns 현재 표시된 텍스트와 타이핑 완료 여부
 */
export const useTypingEffect = (
  text: string,
  options: UseTypingEffectOptions = {}
) => {
  const { delay = 0, speed = 50 } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 텍스트가 변경되면 초기화
    setDisplayedText('');
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    // 지연 시간 후 타이핑 시작
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
};
