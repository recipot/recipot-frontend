import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const maskStyle = { maskType: 'luminance' as const };

const EmotionGoodIcon: React.FC<IconProps> = ({
  color = '#DF6567',
  size = 24,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask
        id="mask0_1248_12127"
        style={maskStyle}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="white" />
      </mask>
      <g mask="url(#mask0_1248_12127)">
        <circle
          cx="2.26431"
          cy="9.02374"
          r="2.18182"
          transform="rotate(-13.6505 2.26431 9.02374)"
          fill={color}
        />
        <circle
          cx="12.6456"
          cy="6.44926"
          r="2.18182"
          transform="rotate(-13.6505 12.6456 6.44926)"
          fill={color}
        />
        <path
          d="M14.4476 13.87C13.1235 15.6083 8.27993 18.3147 3.31663 16.5732"
          stroke={color}
          strokeWidth="2.18182"
          strokeLinecap="round"
        />
        <path
          d="M13.0014 12.5372C13.3879 13.028 14.5878 14.1165 16.2953 14.5438"
          stroke={color}
          strokeWidth="2.18182"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default EmotionGoodIcon;
