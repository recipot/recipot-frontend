import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { CloseIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useReviewForm } from '@/hooks/useReviewForm';
import { cn } from '@/lib/utils';

import { ReviewForm } from './ReviewForm';
import { ReviewHeader } from './ReviewHeader';

import type { ReviewBottomSheetProps } from './types';

export function ReviewBottomSheet({
  onOpenChange,
  open,
  recipeImageUrl,
  recipeTitle,
  timesCooked = 1,
}: ReviewBottomSheetProps) {
  const handleReviewSubmit = () => {
    onOpenChange(false);
  };

  const form = useReviewForm(timesCooked, handleReviewSubmit);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby="review-bottomsheet"
    >
      <DrawerContent
        aria-describedby={undefined}
        className={cn(
          `mx-auto w-full max-w-[390px]`,
          form.feeling === 'good' ? 'h-[844px]' : 'h-[659px]'
        )}
      >
        <DrawerHeader className="sr-only">
          <VisuallyHidden asChild>
            <DrawerTitle>{recipeTitle} 리뷰 작성</DrawerTitle>
          </VisuallyHidden>
        </DrawerHeader>
        <DrawerClose className="absolute top-4 right-5">
          <CloseIcon />
        </DrawerClose>

        <div className="flex flex-col">
          <ReviewHeader
            recipeTitle={recipeTitle}
            recipeImageUrl={recipeImageUrl}
            timesCooked={timesCooked}
          />
          <div className="flex-1">
            <ReviewForm form={form} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ReviewBottomSheet;
