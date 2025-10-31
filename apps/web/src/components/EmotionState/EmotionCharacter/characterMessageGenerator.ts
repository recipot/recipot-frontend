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
  let firstLine = '';
  let secondLine = '';

  if (completedRecipesCount >= 16) {
    firstLine = '어멋! 왤케 건강해졌어???';
  } else if (completedRecipesCount >= 7) {
    firstLine = '와..넌..정말 대단하고.멋지고.존경해.';
  } else if (completedRecipesCount >= 3) {
    firstLine = '와-! 오늘도 해냈다! 잘했어!';
  } else if (completedRecipesCount >= 1) {
    secondLine = '귀찮음을 이겨버렸어! 완전 최고!';
  }

  if (completedRecipesCount >= 3) {
    return `${nickname}님, 지금까지 ${completedRecipesCount}번 해먹었네요!\n${firstLine}`;
  } else {
    return `${nickname}님, 드디어 ${completedRecipesCount}번 해먹었네요!\n${secondLine}`;
  }
};

/**
 * mood와 완료한 레시피 개수에 따른 메시지 생성
 */
export const generateCharacterMessage = ({
  completedRecipesCount,
  mood,
  nickname,
}: MessageParams): string => {
  // mood가 default이고 3회 이상 해먹었을 때만 레벨별 메시지 사용
  if (mood === 'default' && completedRecipesCount >= 3) {
    return getLevelMessage(completedRecipesCount, nickname);
  }

  // mood 선택 시 기본 메시지 사용
  return getMoodMessage(mood);
};
