import React from 'react';
import Image from 'next/image';

import type { ReviewBottomSheetProps } from './types';

export function ReviewHeader({
  recipeImageUrl,
  recipeTitle,
  timesCooked = 1,
}: Pick<
  ReviewBottomSheetProps,
  'recipeImageUrl' | 'recipeTitle' | 'timesCooked'
>) {
  const cookedBadge = (count: number) => {
    if (!count) return null;
    return `${count}번째 해먹기 완료`;
  };

  return (
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
      <div className="mt-5 h-[1px] w-[342px] border border-dashed border-neutral-100" />
    </div>
  );
}
