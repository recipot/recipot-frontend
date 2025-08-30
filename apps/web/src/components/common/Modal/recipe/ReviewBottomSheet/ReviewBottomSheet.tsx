import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button/Button';

import { CloseIcon } from '@/components/Icons';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import EmotionSelector from './EmotionSelector';

import type { ReviewFeeling, ReviewBottomSheetProps } from './types';
import { RecipeProsSelector } from '../RecipeProsSelector';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function ReviewBottomSheet({
  onOpenChange,
  open,
  recipeImageUrl,
  recipeTitle,
  timesCooked = 1,
}: ReviewBottomSheetProps) {
  const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
  const [pros, setPros] = useState<string[]>([]);

  const cookedBadge = (timesCooked: number) => {
    if (!timesCooked) return null;

    return `${timesCooked}번째 해먹기 완료`;
  };

  const togglePro = (text: string) => {
    setPros(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };

  const handleFeelingClick = (selectedFeeling: ReviewFeeling) => {
    setFeeling(prevFeeling =>
      prevFeeling === selectedFeeling ? null : selectedFeeling
    );
  };

  const canSubmit = !!feeling && (feeling !== 'good' || pros.length > 0);
  const goodFeeling = feeling === 'good';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 서버에 제출할 데이터 구조
    const reviewData = {
      feeling,
      pros,
      timesCooked,
      // 기타 필요한 데이터 추가
    };

    console.log(reviewData, 'reviewData');

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
          `mx-auto w-full rounded-t-3xl bg-white ${goodFeeling ? 'h-[844px]' : 'h-[659px]'} flex min-h-[400px] flex-col overflow-hidden shadow-lg`
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

        <div className="flex w-full flex-col items-center justify-center">
          {/* 해먹은 횟수 */}
          {cookedBadge(timesCooked) && (
            <div className="text-14sb mt-4 mb-5 flex h-[31px] w-[11.25rem] items-center justify-center rounded-2xl bg-neutral-100 px-4 py-[5px] text-xs text-neutral-600">
              {cookedBadge(timesCooked)}
            </div>
          )}
          {/* 레시피 타이틀 + 이미지 */}
          <div className="flex flex-col items-center justify-center overflow-y-auto">
            <div className="mb-2 text-lg font-semibold">{recipeTitle}</div>
            {recipeImageUrl && (
              <Image
                src={recipeImageUrl}
                alt={recipeTitle}
                width={72}
                height={72}
                className="rounded-[10.67px]"
              />
            )}
          </div>
          <div className="mt-5 h-[1px] w-[342px] border border-dashed border-neutral-100"></div>

          <div className="mx-auto flex max-w-[292px] flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-[155px]">
                  <EmotionSelector
                    selectedFeeling={feeling}
                    onFeelingSelect={handleFeelingClick}
                  />

                  {feeling === 'good' && (
                    <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
                  )}
                </div>

                <div className="fixed bottom-[30px] left-0 w-full px-6">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-[6.25rem] px-[2rem] py-[0.938rem]"
                  >
                    후기 등록하기
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ReviewBottomSheet;
