import React from 'react';

import type { MeasurementTabProps } from './types';

export function MeasurementTab({
  activeTab,
  categories,
  onTabChange,
}: MeasurementTabProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onTabChange(category)}
          className={`text-14sb flex-shrink-0 px-4 py-2 ${
            activeTab === category
              ? 'border-b-2 border-solid border-black text-gray-900'
              : 'text-gray-600'
          }`}
          aria-pressed={activeTab === category}
          aria-label={`${category} 탭`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
