import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const BackIcon: React.FC<IconProps> = ({ color = '#868E96', size = 18, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath="url(#clip0_1366_28413)">
        <path
          d="M11 5L4 12M11 19L4 12M4 12L20 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1366_28413">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BackIcon;
