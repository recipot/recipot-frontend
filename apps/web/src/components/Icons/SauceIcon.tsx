import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const SauceIcon: React.FC<IconProps> = ({
  color = '#68982D',
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
        d="M5.98611 15C5.28611 15 4.66065 14.758 4.10972 14.274C3.5588 13.79 3.17963 13.1708 2.97222 12.4164L2.36247 10.2737C2.18074 9.63512 2.66034 9 3.32428 9H14.6757C15.3397 9 15.8193 9.63512 15.6375 10.2737L15.0278 12.4164C14.8074 13.1708 14.425 13.79 13.8806 14.274C13.3361 14.758 12.7139 15 12.0139 15H5.98611Z"
        fill={color}
      />
      <path
        d="M14 8H4.58615C2.80459 4.7455 5.60252 2.49261 6.13404 3.0987C6.66557 3.70479 6.34789 4.94037 9.77952 4.94037C13.7741 4.94037 14 6.89811 14 8Z"
        fill={color}
      />
    </svg>
  );
};

export default SauceIcon;
