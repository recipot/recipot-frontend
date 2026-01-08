import type { MoodType } from '@/components/EmotionState';

/**
 * mood를 conditionId로 매핑
 * @param mood - 사용자가 선택한 기분 상태
 * @returns conditionId - 백엔드에서 사용하는 컨디션 ID
 */
export const moodToConditionId = (mood: MoodType): number => {
  const moodMap: Record<MoodType, number> = {
    bad: 1,
    default: 4,
    good: 3,
    neutral: 2,
  };

  return moodMap[mood];
};

/**
 * conditionId를 mood로 매핑 (역변환, 필요시 사용)
 * @param conditionId - 백엔드 컨디션 ID
 * @returns mood - 기분 상태
 */
export const conditionIdToMood = (conditionId: number): MoodType | null => {
  const idMap: Record<number, MoodType> = {
    1: 'bad',
    2: 'neutral',
    3: 'good',
  };

  return idMap[conditionId] ?? null;
};

/**
 * conditionId에 따른 이모지 반환
 * @param conditionId - 백엔드 컨디션 ID (1: bad, 2: neutral, 3: good)
 * @returns 해당 컨디션에 맞는 이모지
 */
export const getEmojiByConditionId = (conditionId: number): string => {
  switch (conditionId) {
    case 1:
      return '\u{1F623}'; // 😣
    case 2:
      return '\u{1F611}'; // 😑
    case 3:
      return '\u{1F60A}'; // 😊
    default:
      return '\u{1F611}'; // 😑
  }
};
