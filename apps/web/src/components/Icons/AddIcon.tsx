import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const AddIcon: React.FC<IconProps> = ({
  color = '#868E96',
  size = 18,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <path
        d="M9 4.5V14.5M4 9.5H14"
        stroke={color}
        strokeWidth="1.42091"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AddIcon;
