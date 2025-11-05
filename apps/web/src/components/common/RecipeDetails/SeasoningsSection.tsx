import React from 'react';

import type { Seasoning } from '@/app/recipe/[id]/types/recipe.types';

import Title from './common/Title';
import { MeasurementGuide } from '../../MeasurementGuide';
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
}: SeasoningsSectionProps) {
  if (seasonings?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      <Title title="양념류" />

      <SeasoningsList
        seasonings={seasonings}
        variant="detail"
        showIcon={showIcon}
      />

      <MeasurementGuide />
    </div>
  );
}
