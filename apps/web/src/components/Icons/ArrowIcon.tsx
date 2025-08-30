import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const ArrowIcon: React.FC<IconProps> = ({
  color = '#868E96',
  size = 18,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 5.5L11 9.5L7 13.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;
