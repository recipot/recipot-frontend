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
  variant = 'detail',
}: SeasoningsListProps) {
  if (seasonings?.length === 0) {
    return null;
  }

  // 레시피 상세 페이지 스타일
  if (variant === 'detail') {
    return (
      <div className="w-full space-y-0 rounded-xl bg-gray-50 px-4 py-5">
        {seasonings.map(seasoning => {
          const IconComponent = getSeasoningIcon(seasoning.name);
          return (
            <div className="flex items-center py-3" key={seasoning.id}>
              <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
                {showIcon && (
                  <div className="flex items-center">
                    {React.createElement(IconComponent, {
                      color: '#68982D',
                      size: 20,
                    })}
                  </div>
                )}
                <span className="text-15sb max-w-[120px] truncate text-gray-700">
                  {seasoning.name}
                </span>
              </div>
              <div className="mx-[18px] h-1 flex-1 border-b border-dashed border-gray-200" />
              <span className="text-15sb max-w-[100px] flex-shrink-0 truncate text-gray-700">
                {seasoning.amount}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // 사이드바 스타일
  return (
    <div className="space-y-2 rounded-lg bg-gray-50 p-3">
      {seasonings.map(seasoning => (
        <div key={seasoning.id} className="flex items-center gap-3">
          <div className="flex flex-1 items-center justify-between">
            <span className="text-15sb mr-2 text-gray-900">
              {seasoning.name}
            </span>
            <div className="mx-[18px] h-1 flex-1 border-b border-dashed border-gray-200" />
            <span className="text-15 ml-2 text-gray-700">
              {seasoning.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
