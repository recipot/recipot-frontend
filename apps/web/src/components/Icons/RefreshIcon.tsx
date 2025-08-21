import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const RefreshIcon: React.FC<IconProps> = ({ color = '#868E96', size = 24, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1248_12096)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.196 4.35C19.6931 4.34779 20.0978 4.74895 20.1 5.246L20.118 7.946C20.1191 8.18617 20.0241 8.4168 19.8542 8.58657C19.6843 8.75635 19.4537 8.85119 19.2135 8.84999L16.9635 8.83199C16.4664 8.8295 16.0655 8.42455 16.068 7.9275C16.0705 7.43045 16.4755 7.02953 16.9725 7.03201L18.314 7.04547L18.3 5.254C18.2978 4.75695 18.6989 4.35221 19.196 4.35Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4.8C8.02406 4.8 4.8 8.02406 4.8 12C4.8 15.9759 8.02406 19.2 12 19.2C15.9759 19.2 19.2 15.9759 19.2 12C19.2 11.5029 19.6029 11.1 20.1 11.1C20.5971 11.1 21 11.5029 21 12C21 16.9701 16.9701 21 12 21C7.02994 21 3 16.9701 3 12C3 7.02994 7.02994 3 12 3C15.1708 3 17.9612 4.64152 19.5603 7.12009C19.8297 7.53776 19.7096 8.0948 19.2919 8.36427C18.8742 8.63373 18.3172 8.51359 18.0477 8.09591C16.7668 6.11048 14.5352 4.8 12 4.8Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1248_12096">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RefreshIcon;
