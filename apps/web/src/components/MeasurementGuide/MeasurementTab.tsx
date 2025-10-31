import React from 'react';

import { MEASUREMENT_TABS } from '@/app/recipe/[id]/_components/IngredientsSection.constants';
import { PowderIcon, WaterIcon } from '@/components/Icons';

import type { MeasurementTabProps } from './types';

export function MeasurementTab({
  activeTab,
  onTabChange,
}: MeasurementTabProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {MEASUREMENT_TABS.map(tab => {
        const isActive = activeTab === tab.id;

        // 아이콘 렌더링: activeIcon이 있으면 사용, 없으면 icon을 사용하되 활성화 상태에 따라 색상 조정
        let iconToShow = tab.icon;
        if (isActive && tab.activeIcon) {
          iconToShow = tab.activeIcon;
        } else if (isActive && !tab.activeIcon) {
          // activeIcon이 없으면 기본 아이콘을 활성화 색상으로 렌더링
          if (tab.id === 'powder') {
            iconToShow = <PowderIcon color="#111827" />;
          } else if (tab.id === 'liquid') {
            iconToShow = <WaterIcon color="#111827" />;
          }
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`text-14sb flex flex-shrink-0 items-center gap-1 px-2 py-2 ${
              isActive
                ? 'border-b-2 border-solid border-black text-gray-900'
                : 'text-gray-600'
            }`}
            aria-pressed={isActive}
            aria-label={`${tab.label} 탭`}
          >
            <div className="flex-none">{iconToShow}</div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
