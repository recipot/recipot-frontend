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
    question: '에너지에 딱 맞는 요리를 찾아드릴게요',
    title: '지금 요리에 에너지를 \n얼마나 쓰고 싶으신가요?',
  },
  {
    id: 2,
    question: '두 가지만 골라도 요리를 찾아드려요',
    title: '현재 냉장고에 어떤 재료를 가지고 계신가요?',
  },
  {
    id: 3,
    question: '요리할 여유가 얼마나 있나요?',
    title: '상태와 재료 딱 두가지만 알려주세요',
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

/** 설문 스텝 개수 (알러지, 컨디션, 재료) - 진행률 표시에 사용 */
export const SURVEY_STEPS = 3;

/** 마지막 스텝 인덱스 (Intro(0) -> Allergy(1) -> Condition(2) -> Ingredients(3) -> Result(4)) */
export const TOTAL_STEPS = 4;
