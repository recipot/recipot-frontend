import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const MASK_STYLE = { maskType: 'luminance' as const };

const EmotionBadIcon: React.FC<IconProps> = ({
  color = '#4164AE',
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
        id="mask0_1248_12125"
        style={MASK_STYLE}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="white" />
      </mask>
      <g mask="url(#mask0_1248_12125)">
        <circle cx="7.09094" cy="14.1818" r="2.18182" fill={color} />
        <circle cx="17.4545" cy="14.1818" r="2.18182" fill={color} />
        <path
          d="M6.54547 22.3636C8.16163 20.0691 13.2525 17.5909 17.4546 22.3636"
          stroke={color}
          strokeWidth="2.18182"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default EmotionBadIcon;
