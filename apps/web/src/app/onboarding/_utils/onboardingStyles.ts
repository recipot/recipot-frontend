import { cn } from '@/lib/utils';

/**
 * 온보딩 관련 스타일 상수
 */
export const onboardingStyles = {
  container: 'container mx-auto max-w-4xl',

  content: {
    wrapper: 'p-6',
  },

  navigation: {
    button: {
      active: 'bg-black text-white',
      base: 'text-15sb inline-block cursor-pointer rounded-full px-4 py-2 transition-all duration-200',
      inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    },
    item: 'flex-shrink-0',
    list: 'flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden',
    wrapper: 'sticky top-[60px] z-10 bg-white py-4',
  },

  stepHeader: {
    description: 'text-18 text-gray-600',
    title: 'text-24 mb-1 whitespace-pre-line',
    wrapper: 'mt-10 mb-4 text-center',
  },

  submitButton: {
    button: 'w-full max-w-md',
    wrapper:
      'fixed right-0 bottom-0 left-0 flex justify-center bg-gradient-to-t from-white via-white to-transparent px-6 py-[10px] pt-8',
  },
} as const;

/**
 * 네비게이션 아이템 클래스 생성
 */
export function getNavigationItemClass(
  index: number,
  totalLength: number
): string {
  return cn(
    onboardingStyles.navigation.item,
    index === 0 && 'pl-4',
    index === totalLength - 1 && 'pr-4'
  );
}

/**
 * 네비게이션 버튼 클래스 생성
 */
export function getNavigationButtonClass(
  isActive: boolean,
  hasScrolled: boolean
): string {
  return cn(
    onboardingStyles.navigation.button.base,
    hasScrolled && isActive
      ? onboardingStyles.navigation.button.active
      : onboardingStyles.navigation.button.inactive
  );
}

/**
 * 제출 버튼 텍스트 생성
 */
export function getSubmitButtonText(
  isSubmitting: boolean,
  stepNumber: number
): string {
  if (isSubmitting) {
    return stepNumber === 3 ? '온보딩 완료 중...' : '저장 중...';
  }

  // step별 버튼 텍스트
  switch (stepNumber) {
    case 1:
      return '안 맞는 재료 선택했어요';
    case 2:
      return '에너지는 이 정도예요';
    case 3:
      return '레시피 추천받을게요';
    default:
      return '안 맞는 재료 선택했어요';
  }
}
