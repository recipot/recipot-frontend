import React from 'react';

import CheckboxIcon from '../common/CheckboxIcon';

interface ImprovementOptionsProps {
  options: Array<{ code: string; codeName: string }> | readonly string[];
  onToggle: (value: string) => void;
  selectedValues: string[];
}

export const ImprovementOptions: React.FC<ImprovementOptionsProps> = ({
  onToggle,
  options,
  selectedValues,
}) => (
  <>
    {options.map(option => {
      const optionText = typeof option === 'string' ? option : option.codeName;
      const optionValue = typeof option === 'string' ? option : option.code;

      return (
        <div
          key={optionValue}
          className="flex cursor-pointer items-center gap-3 py-[10px]"
          onClick={() => onToggle(optionValue)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle(optionValue);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <CheckboxIcon isSelected={selectedValues.includes(optionValue)} />
          <span className="text-base text-[#000000]/96">{optionText}</span>
        </div>
      );
    })}
  </>
);
