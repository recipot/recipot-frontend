import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const MeasuringIcon = ({
  color = '#495057',
  size = 18,
  ...props
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.0447 10.167C17.0447 9.64164 16.6176 9.21191 16.0933 9.24609C12.9123 9.45351 11.1502 10.6757 9.96926 11.4355H1.82353C1.29813 11.4355 0.861829 11.8665 0.975073 12.3796C1.41628 14.3785 3.21441 15.875 5.15317 15.875H5.62883C6.63962 15.875 7.86683 15.4643 8.57438 14.7651C10.0299 13.4111 11.6674 12.2568 13.5575 11.835C14.3504 11.6626 15.2041 11.5266 16.0941 11.4675C16.6183 11.4327 17.0447 11.0096 17.0447 10.4842V10.167Z"
        fill={color}
      />
      <path
        d="M1.99354 6.93039H4.84752V9.78437H1.99354V6.93039Z"
        fill={color}
      />
      <path
        d="M5.79885 6.93039H8.65282V9.78437H5.79885V6.93039Z"
        fill={color}
      />
      <path d="M3.89619 3.125H6.75017V5.97898H3.89619V3.125Z" fill={color} />
    </svg>
  );
};

export default MeasuringIcon;
