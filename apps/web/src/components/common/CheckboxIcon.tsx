import React from 'react';

import CheckIcon from '@/components/Icons/CheckIcon';
import { cn } from '@/lib/utils';

function CheckboxIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <div className="relative flex h-6 w-6 items-center justify-center">
      <div
        className={cn(
          'absolute inset-0 rounded-md border-[1px]',
          isSelected
            ? 'border-secondary-soft-green bg-secondary-soft-green'
            : 'border-secondary-soft-green bg-white'
        )}
      />
      <CheckIcon
        size={14}
        color={isSelected ? '#68982D' : '#D7E8C2'}
        className="relative"
      />
    </div>
  );
}

export default CheckboxIcon;
