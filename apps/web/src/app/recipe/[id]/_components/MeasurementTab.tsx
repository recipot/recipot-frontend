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
      className={`flex h-[34px] w-fit cursor-pointer items-center justify-center gap-1 px-2 ${
        isActive ? 'border-b-2 border-solid border-black' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="order-0 flex-none flex-grow-0">{iconToShow}</div>
      <p
        className={`order-1 h-[21px] flex-none flex-grow-0 text-sm leading-[150%] font-semibold whitespace-nowrap ${
          isActive ? 'text-gray-900' : 'text-gray-600'
        }`}
      >
        {tab.label}
      </p>
    </div>
  );
}

export default MeasurementTab;
