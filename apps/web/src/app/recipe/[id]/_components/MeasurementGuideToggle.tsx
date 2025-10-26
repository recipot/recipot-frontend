import React from 'react';

import { ArrowIcon } from '@/components/Icons';

interface MeasurementGuideToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MeasurementGuideToggle({
  isOpen,
  onToggle,
}: MeasurementGuideToggleProps) {
  return (
    <div
      className="mt-5 flex cursor-pointer items-center justify-between px-3 py-1.5 transition-colors"
      onClick={onToggle}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      role="button"
      tabIndex={0}
    >
      <div className="text-15sb text-gray-600">계량가이드</div>
      <ArrowIcon
        size={20}
        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      />
    </div>
  );
}

export default MeasurementGuideToggle;
