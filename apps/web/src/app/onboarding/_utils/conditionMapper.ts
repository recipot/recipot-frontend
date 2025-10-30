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
