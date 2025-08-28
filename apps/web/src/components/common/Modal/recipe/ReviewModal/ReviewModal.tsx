import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button/Button';

import { CloseIcon } from '@/components/Icons';
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

import EmotionSelector from './EmotionSelector';

import type { ReviewFeeling, ReviewModalProps } from './types';
import { RecipeProsSelector } from '../ProsSection';

export function ReviewModal({
  onOpenChange,
  open,
  recipeImageUrl,
  recipeTitle,
  timesCooked = 1,
}: ReviewModalProps) {
  const [feeling, setFeeling] = useState<ReviewFeeling | null>(null);
  const [pros, setPros] = useState<string[]>([]);

  const cookedBadge = (timesCooked: number) => {
    if (!timesCooked) return null;
    if (timesCooked <= 1) return `첫 해먹기 레시피예요!`;
    return `${timesCooked}번째 해먹기 완료한 레시피네요!`;
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
        className={cn(
          `w-[390px] mx-auto rounded-t-3xl bg-white ${goodFeeling ? 'h-[90vh]' : 'h-[80vh]'} shadow-lg min-h-[400px] flex flex-col overflow-hidden`
        )}
      >
        <DrawerClose className="absolute right-3 top-3">
          <CloseIcon />
        </DrawerClose>

        <div className="w-full flex flex-col items-center justify-center">
          {/* 해먹은 횟수 */}
          {cookedBadge(timesCooked) && (
            <div className="w-[212px] h-[31px] flex justify-center items-center rounded-full bg-neutral-100 px-4 py-[5px] mb-5 text-xs text-neutral-600">
              {cookedBadge(timesCooked)}
            </div>
          )}
          {/* 레시피 타이틀 + 이미지 */}
          <div className="flex flex-col justify-center items-center overflow-y-auto">
            <div className="text-lg font-semibold mb-2">{recipeTitle}</div>
            {recipeImageUrl && (
              <Image
                src={recipeImageUrl}
                alt={recipeTitle}
                width={72}
                height={72}
                className="rounded-md"
              />
            )}
          </div>
          <div className="dashed border border-dashed h-[1px] border-neutral-100 mt-5 w-[342px]"></div>

          <div className="mx-auto flex max-w-[292px] flex-col justify-center items-center">
            <div className="flex flex-col items-center">
              <form onSubmit={handleSubmit} className="w-full">
                <EmotionSelector
                  selectedFeeling={feeling}
                  onFeelingSelect={handleFeelingClick}
                />

                {feeling === 'good' && (
                  <RecipeProsSelector pros={pros} onTogglePro={togglePro} />
                )}

                <div className="fixed bottom-[30px] left-0 w-full px-6 gap-[155px]">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
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

export default ReviewModal;
