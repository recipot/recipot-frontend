/**
 * 공통 컴포넌트 Props 타입 정의
 */

/**
 * 이미지 표시 여부를 제어하는 공통 prop
 * EmotionState, CookStateStep 등에서 사용
 */
export interface ShowImageProps {
  /** 이미지 표시 여부 */
  showImage?: boolean;
}
