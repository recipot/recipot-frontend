import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const MASK_STYLE = { maskType: 'luminance' as const };

const EmotionNeutralIcon: React.FC<IconProps> = ({
  color = '#AD7E06',
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
        id="mask0_1248_12126"
        style={MASK_STYLE}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="white" />
      </mask>
      <g mask="url(#mask0_1248_12126)">
        <path
          d="M6.54547 16.9091H17.4546"
          stroke={color}
          strokeWidth="2.18182"
          strokeLinecap="round"
        />
        <circle cx="7.09094" cy="9.27273" r="2.18182" fill={color} />
        <circle cx="17.4545" cy="9.27273" r="2.18182" fill={color} />
      </g>
    </svg>
  );
};

export default EmotionNeutralIcon;
