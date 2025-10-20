import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const SourceIcon: React.FC<IconProps> = ({
  color = '#68982D',
  size = 24,
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
        d="M17.0438 9.66704C17.0438 9.14164 16.6166 8.7119 16.0923 8.74609C12.9113 8.95351 11.1493 10.1757 9.96834 10.9355H1.82261C1.29721 10.9355 0.860914 11.3665 0.974157 11.8796C1.41537 13.8785 3.2135 15.375 5.15225 15.375H5.62792C6.6387 15.375 7.86591 14.9643 8.57346 14.2651C10.029 12.9111 11.6665 11.7568 13.5566 11.335C14.3495 11.1626 15.2032 11.0266 16.0932 10.9675C16.6174 10.9327 17.0438 10.5096 17.0438 9.98415V9.66704Z"
        fill={color}
      />
      <path d="M1.99263 6.43039H4.8466V9.28437H1.99263V6.43039Z" fill={color} />
      <path
        d="M5.79793 6.43039H8.65191V9.28437H5.79793V6.43039Z"
        fill={color}
      />
      <path d="M3.89528 2.625H6.74926V5.47898H3.89528V2.625Z" fill={color} />
    </svg>
  );
};

export default SourceIcon;
