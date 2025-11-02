import type { ReviewOption } from '@recipot/api';

export type { ReviewData, ReviewOption } from '@recipot/api';

export interface ReviewFormData {
  completedRecipeId: number;
  tasteOption: ReviewOption | null;
  difficultyOption: ReviewOption | null;
  experienceOption: ReviewOption | null;
  content: string;
}

// 컴포넌트 props 타입
export interface ReviewBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number; // 후기 제출 시 completedRecipeId로 사용
}
