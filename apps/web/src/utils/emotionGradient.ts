import type { MoodType } from '@/components/EmotionState';

/**
 * 감정 상태에 따른 그래디언트 클래스 반환 함수
 * @param mood - 사용자가 선택한 기분 상태
 * @returns 해당 감정에 맞는 CSS 클래스명
 */
export const getEmotionGradient = (mood: MoodType): string => {
  const gradientMap: Record<MoodType, string> = {
    bad: 'emotion-gradient-bad',
    good: 'emotion-gradient-good',
    neutral: 'emotion-gradient-neutral',
  };
  return gradientMap[mood];
};
