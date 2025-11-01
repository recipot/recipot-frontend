/**
 * 온보딩 관련 상수들
 */
export const ONBOARDING_CONSTANTS = {
  /** 스크롤 감지 임계값 (px) */
  SCROLL_THRESHOLD: 50,
  /** ScrollSpy 오프셋 (px) */
  SCROLL_SPY_OFFSET: 150,
  /** 최소 선택 재료 개수 */
  MIN_SELECTED_FOODS: 2,
  /** 데이터 만료 기간 (일) */
  DATA_EXPIRY_DAYS: 7,
  /** 세션 ID 접두사 */
  SESSION_ID_PREFIX: 'onboarding',
} as const;

/**
 * 온보딩 스텝 설정
 */
export const STEP_CONFIG = [
  {
    description: '알려주시면 그 재료는 빼고 추천해드릴게요',
    id: 1,
    title: '몸에 안 맞는 재료가 있나요?',
  },
  {
    description: '에너지에 딱 맞는 요리를 찾아드릴게요',
    id: 2,
    title: '지금 요리에 에너지를 \n얼마나 쓰고 싶으신가요?',
  },
  {
    description: '두가지만 골라도 요리를 추천해드릴게요',
    id: 3,
    title: '마지막으로 \n냉장고 속 재료, 뭐가 있나요?',
  },
] as const;

/**
 * 스크롤바 숨김 스타일
 */
export const SCROLLBAR_HIDE_STYLE = {
  msOverflowStyle: 'none' as const,
  scrollbarWidth: 'none' as const,
} as const;

/**
 * 온보딩 스텝 번호 타입
 */
export type OnboardingStepNumber = 1 | 2 | 3;

/**
 * 온보딩 스텝 설정 타입
 */
export type StepConfigItem = (typeof STEP_CONFIG)[number];
