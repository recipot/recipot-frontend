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

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      aria-labelledby="review-bottomsheet"
    >
      <DrawerContent
        aria-describedby={undefined}
        className={cn(
          `mx-auto flex h-[844px] min-h-[400px] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lg`
        )}
      >
        <DrawerHeader className="sr-only">
          <VisuallyHidden asChild>
            <DrawerTitle>{recipeTitle} 리뷰 작성</DrawerTitle>
          </VisuallyHidden>
        </DrawerHeader>
        <DrawerClose className="absolute top-3 right-3">
          <CloseIcon />
        </DrawerClose>

        <ReviewHeader
          recipeTitle={recipeTitle}
          recipeImageUrl={recipeImageUrl}
          timesCooked={timesCooked}
        />

        <ReviewForm
          timesCooked={timesCooked}
          onReviewSubmit={handleReviewSubmit}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default ReviewBottomSheet;
