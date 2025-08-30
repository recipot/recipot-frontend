import type { StaticImageData } from 'next/image';

export type ReviewFeeling = 'bad' | 'soso' | 'good';

export interface ReviewBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  recipeImageUrl: StaticImageData | string;
  timesCooked?: number;
}
