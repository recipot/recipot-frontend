/**
 * A/B 테스트 B안 상수 정의
 */

/** 알러지 스텝 설정 (못 먹는 재료 선택) */
export const AB_ALLERGY_STEP_CONFIG = {
  buttonText: '안 맞는 재료 선택했어요',
  description: '알려주시면 그 재료는 빼고 추천해드릴게요',
  title: '몸에 안 맞는 재료가 있나요?',
} as const;

/** 스텝별 설정 */
export const AB_STEP_CONFIG = [
  {
    id: 1,
    question: '지금 요리에 에너지를 \n얼마나 쓰고 싶으신가요?',
    title: '내 컨디션에 딱 맞는 한 끼',
  },
  {
    id: 2,
    question: '냉장고 속 재료를 입력해보세요',
    title: '내가 가진 재료로 바로 가능한!',
  },
  {
    id: 3,
    question: '',
    title: '', // 동적으로 생성됨 (컨디션에 따라)
  },
] as const;

/** 컨디션별 레시피 추천 제목 */
export const CONDITION_TITLES = {
  bad: '힘들때도 해먹을 수 있는\n초간단 레시피',
  good: '여유있게 만들 수 있는\n맛있는 레시피',
  neutral: '적당히 해먹을 수 있는\n간편 레시피',
} as const;

/** 컨디션별 상태 메시지 */
export const CONDITION_STATUS = {
  bad: '요리할 여유가 거의...없어요',
  good: '요리할 여유가 충분해요!',
  neutral: '요리할 여유가 그저 그래요',
} as const;

/** 최소 선택 재료 개수 */
export const MIN_SELECTED_FOODS = 2;

/** 스텝 총 개수 */
export const TOTAL_STEPS = 3;
