import type { MoodType } from '@/components/EmotionState';

export const getBackgroundColor = (
  index: number,
  mood: MoodType = 'neutral'
) => {
  const gradientColors: Record<MoodType, { r: number; g: number; b: number }> =
    {
      bad: { b: 181, g: 112, r: 79 }, // #4F70B5 - 파란색 계열
      default: { b: 208, g: 255, r: 232 }, // 연두색 계열
      good: { b: 132, g: 114, r: 207 }, // #CF7284 - 분홍색 계열
      neutral: { b: 42, g: 170, r: 189 }, // #BDAA2A - 노란색 계열
    };

  const color = gradientColors[mood];
  const opacity = index % 2 === 0 ? 0.15 : 0.3;

  return {
    backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`,
  };
};
