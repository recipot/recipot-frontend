import React from 'react';

import type { IconProps } from '@/types/Icon.types';

const GoogleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1248_12099)">
        <g clipPath="url(#clip1_1248_12099)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.6397 10.227C19.6397 9.51761 19.5756 8.8365 19.4578 8.18176H10.04V12.0499H15.422C15.1903 13.3 14.4856 14.3589 13.4268 15.0682V17.577H16.659C18.5497 15.836 19.6406 13.2727 19.6406 10.227H19.6397Z"
            fill="#4285F4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0403 20C12.7402 20 15.004 19.1041 16.6583 17.577L13.4261 15.0683C12.5302 15.6684 11.3856 16.0226 10.0394 16.0226C7.43455 16.0226 5.23012 14.2638 4.4435 11.9002H1.10388V14.4909C2.74967 17.7589 6.13073 20 10.0403 20Z"
            fill="#34A853"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.44418 11.9001C4.24447 11.3 4.13048 10.6594 4.13048 10C4.13048 9.34056 4.24447 8.69995 4.44418 8.09986V5.50919H1.10363C0.426285 6.85916 0.0400391 8.38625 0.0400391 10C0.0400391 11.6138 0.426285 13.1408 1.10363 14.4908L4.44418 11.9001Z"
            fill="#FBBC05"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0403 3.97739C11.508 3.97739 12.8269 4.48234 13.8632 5.47244L16.7318 2.60386C14.9993 0.99105 12.7355 0 10.0403 0C6.13073 0 2.74967 2.24117 1.10388 5.50919L4.44444 8.09986C5.23106 5.73622 7.43549 3.97739 10.0403 3.97739Z"
            fill="#EA4335"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1248_12099">
          <rect width="20" height="20" fill="white" />
        </clipPath>
        <clipPath id="clip1_1248_12099">
          <rect
            width="19.5996"
            height="20"
            fill="white"
            transform="translate(0.0400391)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GoogleIcon;
