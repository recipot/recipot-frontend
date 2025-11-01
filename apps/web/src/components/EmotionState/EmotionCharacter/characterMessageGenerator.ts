import type { MoodType } from '../index';

/**
 * 메시지 생성 파라미터
 */
export interface MessageParams {
  mood: MoodType;
  completedRecipesCount: number;
  nickname: string;
}

/**
 * mood에 따른 기본 메시지 반환
 */
const getMoodMessage = (mood: MoodType): string => {
  switch (mood) {
    case 'bad':
      return '너도 힘들구나... 그맘알지😣\n재료만 고르면 내가 알아서 해볼게!';
    case 'neutral':
      return '그 느낌 알지... 뭔가 애매한 날...😑\n편하게 재료만 골라봐~';
    case 'good':
      return '나도 오늘 컨디션 최고야!☺️\n재료만 알려줘! 같이 요리해보자!';
    default:
      return '지금 너의 상태가 어떤지 알려줄래?\n내가 딱 맞는 요리를 찾아줄게';
  }
};

/**
 * 레벨별 메시지 생성
 */
const getLevelMessage = (
  completedRecipesCount: number,
  nickname: string
): string => {
  // 최초 1회 요리했을 때만 특별한 메시지
  if (completedRecipesCount === 1) {
    return `${nickname}님, 드디어 ${completedRecipesCount}번 해먹었네요!\n귀찮음을 이겨버렸어! 완전 최고!`;
  }

  // 16회 이상 (레벨 3)
  if (completedRecipesCount >= 16) {
    return `${nickname}님, 지금까지 ${completedRecipesCount}번 해먹었네요!\n어멋! 왤케 건강해졌어???`;
  }

  // 7~15회 (레벨 2)
  if (completedRecipesCount >= 7) {
    return `${nickname}님, 지금까지 ${completedRecipesCount}번 해먹었네요!\n와..넌..정말 대단하고.멋지고.존경해.`;
  }

  // 3~6회 (레벨 1)
  if (completedRecipesCount >= 3) {
    return `${nickname}님, 지금까지 ${completedRecipesCount}번 해먹었네요!\n와-! 오늘도 해냈다! 잘했어!`;
  }

  // 0회 또는 2회일 때 (레벨 0) - 여기는 도달하지 않아야 함 (generateCharacterMessage에서 필터링됨)
  return `${nickname}님, 지금까지 ${completedRecipesCount}번 해먹었네요!`;
};

/**
 * mood와 완료한 레시피 개수에 따른 메시지 생성
 */
export const generateCharacterMessage = ({
  completedRecipesCount,
  mood,
  nickname,
}: MessageParams): string => {
  // mood가 default이고 1회 이상 해먹었을 때 레벨별 메시지 사용
  if (mood === 'default' && completedRecipesCount >= 1) {
    return getLevelMessage(completedRecipesCount, nickname);
  }

  // mood 선택 시 기본 메시지 사용
  return getMoodMessage(mood);
};
