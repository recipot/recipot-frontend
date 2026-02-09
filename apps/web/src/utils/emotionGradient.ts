import type { MoodType } from '@/components/EmotionState';

/**
 * 감정 상태에 따른 그래디언트 클래스 반환 함수
 * @param mood - 사용자가 선택한 기분 상태
 * @returns 해당 감정에 맞는 CSS 클래스명
 */
export const getEmotionGradient = (mood: MoodType): string => {
  const gradientMap: Record<MoodType, string> = {
    bad: 'emotion-gradient-bad',
    default: 'emotion-gradient-default',
    good: 'emotion-gradient-good',
    neutral: 'emotion-gradient-neutral',
  };
  // eslint-disable-next-line security/detect-object-injection
  return gradientMap[mood];
};

/**
 * 감정 상태에 따른 카드 오버레이 그라데이션 스타일 반환 함수
 * @param mood - 사용자가 선택한 기분 상태
 * @returns 해당 감정에 맞는 그라데이션 스타일 객체
 */
export const getEmotionGradientOverlay = (
  mood: MoodType
): { background: string } => {
  const gradientColors: Record<MoodType, { r: number; g: number; b: number }> =
    {
      bad: { b: 181, g: 112, r: 79 }, // #4F70B5 - 파란색 계열
      default: { b: 208, g: 255, r: 232 }, // 연두색 계열
      good: { b: 132, g: 114, r: 207 }, // #CF7284 - 분홍색 계열
      neutral: { b: 42, g: 170, r: 189 }, // #BDAA2A - 노란색 계열
    };

  // eslint-disable-next-line security/detect-object-injection
  const color = gradientColors[mood];
  const background = `linear-gradient(180deg, rgba(${color.r}, ${color.g}, ${color.b}, 0) 0%, rgba(${color.r}, ${color.g}, ${color.b}, 0.8) 50%, rgba(${color.r}, ${color.g}, ${color.b}, 0.95) 100%)`;

  return { background };
};
