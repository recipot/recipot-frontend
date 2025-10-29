import type { MoodType } from '@/components/EmotionState';

import type { OnboardingStepNumber } from '../_constants';

/**
 * 온보딩 스텝 공통 Props
 */
export interface OnboardingStepProps {
  stepNumber: OnboardingStepNumber;
  isSubmitting: boolean;
}



/**
 * 알레르기 스텝 데이터
 */
export interface AllergyStepData {
  allergies: number[];
  selectedItems: number[];
}

/**
 * 요리 상태 스텝 데이터
 */
export interface CookStateStepData {
  mood: MoodType;
}

/**
 * 냉장고 스텝 데이터
 */
export interface RefrigeratorStepData {
  selectedFoods: number[];
}

/**
 * 온보딩 스텝별 데이터 타입 맵
 */
export interface OnboardingStepDataMap {
  1: AllergyStepData;
  2: CookStateStepData;
  3: RefrigeratorStepData;
}

/**
 * 네비게이션 섹션 정보
 */
export interface NavigationSection {
  id: string;
  label: string;
}

/**
 * 스크롤 네비게이션 Props
 */
export interface ScrollNavigationProps {
  sections: NavigationSection[];
  activeSection: string | null;
  hasScrolled: boolean;
  onScrollToSection: (sectionId: string) => void;
  gnbRef: React.RefObject<HTMLUListElement>;
}

/**
 * 온보딩 에러 타입
 */
export interface OnboardingError {
  step: OnboardingStepNumber;
  message: string;
  originalError?: Error;
}
