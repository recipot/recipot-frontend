import React from 'react';

interface BackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const BackIcon: React.FC<BackIconProps> = ({ color = '#868E96', size = 18, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1248_12097)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L5.41421 12L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1248_12097">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BackIcon;
