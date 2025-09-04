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
          `mx-auto w-full`,
          // 모바일: 기본 바텀시트
          'max-w-sm sm:max-w-lg',
          // 태블릿: 더 큰 크기
          'md:max-w-2xl',
          // 데스크톱: 바텀시트 유지, 더 큰 크기
          'lg:max-w-4xl xl:max-w-5xl',
          // 높이 조정 - 모든 사이즈에서 바텀시트로 동작
          form.feeling === 'good'
            ? 'h-[52rem] sm:h-[44rem] md:h-[38rem] lg:h-[41rem] xl:h-[44rem]'
            : 'h-[41rem] sm:h-[34rem] md:h-[31rem] lg:h-[34rem] xl:h-[38rem]'
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
