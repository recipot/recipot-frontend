import React from 'react';

const MultiPanIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3026_6581)">
        <rect
          x="13.4648"
          y="35.6777"
          width="20"
          height="20"
          rx="10"
          transform="rotate(-135 13.4648 35.6777)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="24.0713"
          y="13.7574"
          width="4"
          height="10"
          rx="1"
          transform="rotate(-135 24.0713 13.7574)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="21.2432"
          y="15.1716"
          width="2"
          height="3"
          transform="rotate(-135 21.2432 15.1716)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="19.4648"
          y="40.6777"
          width="20"
          height="20"
          rx="10"
          transform="rotate(-135 19.4648 40.6777)"
          fill="white"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="19.4648"
          y="36.435"
          width="14"
          height="14"
          rx="7"
          transform="rotate(-135 19.4648 36.435)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="30.0713"
          y="18.7574"
          width="4"
          height="8"
          rx="1"
          transform="rotate(-135 30.0713 18.7574)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="27.2432"
          y="20.1716"
          width="2"
          height="3"
          transform="rotate(-135 27.2432 20.1716)"
          stroke={color}
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_3026_6581">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MultiPanIcon;
