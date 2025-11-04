import React from 'react';

const MicroWaveIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="30"
        height="26"
        rx="1"
        stroke={color}
        strokeWidth="2"
      />
      <circle cx="30" cy="12" r="1" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="17" r="1" stroke={color} strokeWidth="2" />
      <rect
        x="8"
        y="9"
        width="17"
        height="20"
        rx="1"
        stroke={color}
        strokeWidth="2"
      />
      <rect
        x="-1"
        y="1"
        width="4"
        height="6"
        rx="1"
        transform="matrix(-1 0 0 1 31 21)"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M10 33V34C10 34.5523 9.55228 35 9 35C8.44772 35 8 34.5523 8 34V33"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M32 33V34C32 34.5523 31.5523 35 31 35C30.4477 35 30 34.5523 30 34V33"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M11 15C11.9725 14.2454 14.4862 13.1889 16.7614 15C19.0366 16.8111 21.2018 15.7546 22 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 19C11.9725 18.2454 14.4862 17.1889 16.7614 19C19.0366 20.8111 21.2018 19.7546 22 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 23C11.9725 22.2454 14.4862 21.1889 16.7614 23C19.0366 24.8111 21.2018 23.7546 22 23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MicroWaveIcon;
