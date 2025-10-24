import type { StaticImageData } from 'next/image';

export interface ReviewFormData {
  completedRecipeId: number;
  tasteOptions: {
    code: string;
    codeName: string;
  }[];
  difficultyOptions: {
    code: string;
    codeName: string;
  }[];
  experienceOptions: {
    code: string;
    codeName: string;
  }[];
  content: string;
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
  tasteOptions: {
    code: string;
    codeName: string;
  }[];
  difficultyOptions: {
    code: string;
    codeName: string;
  }[];
  experienceOptions: {
    code: string;
    codeName: string;
  }[];
  completionMessage: string;
}
