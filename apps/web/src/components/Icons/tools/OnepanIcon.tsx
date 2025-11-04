import React from 'react';

const OnepanIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3026_6590)">
        <rect
          x="16.4648"
          y="38.6777"
          width="20"
          height="20"
          rx="10"
          transform="rotate(-135 16.4648 38.6777)"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="16.4648"
          y="34.435"
          width="14"
          height="14"
          rx="7"
          transform="rotate(-135 16.4648 34.435)"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M26.3642 16.0502L24.95 14.636C24.5594 14.2455 24.5594 13.6123 24.95 13.2218L30.6068 7.56497C30.9973 7.17444 31.6305 7.17444 32.021 7.56497L33.4352 8.97918C33.8258 9.36971 33.8258 10.0029 33.4352 10.3934L27.7784 16.0502C27.3879 16.4408 26.7547 16.4408 26.3642 16.0502Z"
          stroke={color}
          strokeWidth="2"
        />
        <rect
          x="24.2432"
          y="18.1716"
          width="2"
          height="3"
          transform="rotate(-135 24.2432 18.1716)"
          stroke={color}
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_3026_6590">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default OnepanIcon;
