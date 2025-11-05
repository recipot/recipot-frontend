import React from 'react';

import { getSeasoningIcon } from '@/utils/iconMatcher';

// Seasoning 타입 정의 (Recipe.seasonings와 호환)
type Seasoning = {
  id: number;
  name: string;
  amount: string;
};

interface SeasoningsListProps {
  /** 양념류 배열 */
  seasonings: Seasoning[];
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  /** 스타일 variant: 'detail' (레시피 상세 페이지) 또는 'sidebar' (사이드바) */
  variant?: 'detail' | 'sidebar';
}

export function SeasoningsList({
  seasonings,
  showIcon = false,
}: SeasoningsListProps) {
  if (seasonings?.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-5 rounded-xl bg-gray-50 px-4 py-5">
      {seasonings.map(seasoning => {
        const IconComponent = getSeasoningIcon(seasoning.name);
        return (
          <div className="flex items-center" key={seasoning.id}>
            <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
              {showIcon && <IconComponent color="#68982D" size={20} />}
              <span className="text-15sb text-gray-700">{seasoning.name}</span>
            </div>
            <div className="mx-2 h-1 flex-1 border-b border-dashed border-gray-200" />
            <span className="text-15 flex-shrink-0 text-gray-700">
              {seasoning.amount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
