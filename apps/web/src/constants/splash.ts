/**
 * 스플래시 스크린 관련 상수
 */

/**
 * 스플래시 스크린이 화면에 표시되는 시간 (밀리초)
 * 이 시간이 지나면 페이드아웃 애니메이션이 시작됩니다.
 */
export const SPLASH_DISPLAY_DURATION = 2500;

/**
 * 페이드아웃 애니메이션 지속 시간 (밀리초)
 * CSS transition-opacity duration-500과 일치해야 합니다.
 */
export const SPLASH_FADE_OUT_DURATION = 500;

/**
 * 스플래시 스크린이 DOM에서 완전히 제거되는 시간 (밀리초)
 * SPLASH_DISPLAY_DURATION + SPLASH_FADE_OUT_DURATION
 */
export const SPLASH_TOTAL_DURATION =
  SPLASH_DISPLAY_DURATION + SPLASH_FADE_OUT_DURATION;
