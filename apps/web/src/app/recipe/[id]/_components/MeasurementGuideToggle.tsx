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
    <div className="mt-5 flex items-center justify-between px-3 py-1.5 transition-colors">
      <div className="text-15sb text-gray-600">계량가이드</div>
      <ArrowIcon
        size={20}
        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        onClick={onToggle}
      />
    </div>
  );
}

export default MeasurementGuideToggle;
