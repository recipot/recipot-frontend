import React from 'react';

import PowderIcon from '@/components/Icons/PowderIcon';

import type { Seasoning } from '../types/recipe.types';

interface SeasoningListProps {
  seasonings: Seasoning[];
}

export function SeasoningList({ seasonings }: SeasoningListProps) {
  if (seasonings?.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-0 rounded-xl bg-gray-50 px-4 py-5">
      {seasonings?.map((seasoning, index) => (
        <div className="flex items-center py-3" key={index}>
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <PowderIcon />
            <span className="text-15sb max-w-[120px] truncate text-gray-700">
              {seasoning.name}
            </span>
          </div>
          <div className="mx-[18px] h-1 flex-1 border-b border-dashed border-gray-200" />
          <span className="text-15sb max-w-[100px] flex-shrink-0 truncate text-gray-700">
            {seasoning.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SeasoningList;
