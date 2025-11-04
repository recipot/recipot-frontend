import React from 'react';

const CutIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="15"
        y="6"
        width="20"
        height="28"
        rx="3"
        stroke={color}
        strokeWidth="2"
      />
      <rect
        x="21"
        y="27"
        width="8"
        height="3"
        rx="1.5"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M4 6.02734C7.91875 6.34535 11 9.62432 11 13.625V23H5C4.44772 23 4 22.5523 4 22V6.02734Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M8 23V33C8 33.5523 7.55228 34 7 34H5C4.44772 34 4 33.5523 4 33V23H8Z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export default CutIcon;
