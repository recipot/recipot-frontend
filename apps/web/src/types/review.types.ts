export interface ReviewData {
  recipeId: string;
  recipeName: string;
  recipeImage?: string;
  completionCount: number;
}

export interface EmotionRating {
  taste: 'bad' | 'neutral' | 'good' | null;
  difficulty: 'hard' | 'medium' | 'easy' | null;
  cooking: 'hard' | 'medium' | 'easy' | null;
}

export interface ReviewFormData {
  emotions: EmotionRating;
  comment: string;
}

export interface ReviewBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  reviewData: ReviewData;
}
