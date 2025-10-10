import React from 'react';

import type { MeasurementTab } from './IngredientsSection.constants';

interface MeasurementTabProps {
  tab: MeasurementTab;
  isActive: boolean;
  onClick: (tabId: string) => void;
}

export function MeasurementTab({
  isActive,
  onClick,
  tab,
}: MeasurementTabProps) {
  const handleClick = () => {
    onClick(tab.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const iconToShow = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer items-center gap-1 pb-2 ${
        isActive ? 'border-b-2 border-solid border-gray-900' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {iconToShow}
      <p
        className={`text-14 whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
      >
        {tab.label}
      </p>
    </div>
  );
}

export default MeasurementTab;
