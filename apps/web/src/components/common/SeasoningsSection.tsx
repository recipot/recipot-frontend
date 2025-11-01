import React from 'react';

import type { Seasoning } from '@/app/recipe/[id]/types/recipe.types';

import { MeasurementGuide } from '../MeasurementGuide';
import { SeasoningsList } from './SeasoningsList';

interface SeasoningsSectionProps {
  /** 양념류 배열 */
  seasonings: Seasoning[];
  /** 아이콘 표시 여부 */
  showIcon?: boolean;
  /** 스타일 variant: 'detail' (레시피 상세 페이지) 또는 'sidebar' (사이드바) */
  variant?: 'detail' | 'sidebar';
}

export function SeasoningsSection({
  seasonings,
  showIcon = false,
  variant = 'detail',
}: SeasoningsSectionProps) {
  if (seasonings?.length === 0) {
    return null;
  }

  if (variant === 'detail') {
    return (
      <div className="mt-8">
        <div className="rounded-2xl bg-white p-4">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">양념류</h3>
          </div>

          <SeasoningsList
            seasonings={seasonings}
            variant="detail"
            showIcon={showIcon}
          />

          <div className="mt-5">
            <MeasurementGuide />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <span className="text-14sb text-gray-900">양념류</span>
      </div>
      <SeasoningsList
        seasonings={seasonings}
        variant="sidebar"
        showIcon={showIcon}
      />

      {/* 계량 가이드 */}
      <div className="mt-5">
        <MeasurementGuide />
      </div>
    </div>
  );
}
