import React from 'react';

import { MEASUREMENT_TABS } from '@/app/recipe/[id]/_components/IngredientsSection.constants';

import type { MeasurementTabProps } from './types';

export function MeasurementTab({
  activeTab,
  onTabChange,
}: MeasurementTabProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {MEASUREMENT_TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const iconToShow = isActive ? (tab.activeIcon ?? tab.icon) : tab.icon;

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
