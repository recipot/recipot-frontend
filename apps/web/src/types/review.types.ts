import type { StaticImageData } from 'next/image';

export interface ReviewOption {
  code: string;
  codeName: string;
}

export interface ReviewFormData {
  completedRecipeId: number;
  tasteOption: ReviewOption | null;
  difficultyOption: ReviewOption | null;
  experienceOption: ReviewOption | null;
  content: string;
}

export interface ReviewSubmitData {
  completedRecipeId: number;
  tasteOptions: ReviewOption[];
  difficultyOptions: ReviewOption[];
  experienceOptions: ReviewOption[];
  content: string;
  completionCount: number;
  completionMessage: string;
  recipeImageUrl?: string;
  recipeName: string;
}

export interface ReviewBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ReviewData {
  recipeId: string;
  recipeName: string;
  recipeImageUrl?: string | StaticImageData | undefined;
  completionCount: number;
  tasteOptions: ReviewOption[];
  difficultyOptions: ReviewOption[];
  experienceOptions: ReviewOption[];
  completionMessage: string;
}
