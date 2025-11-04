import React from 'react';

const RiceCookerIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 9H26C29.866 9 33 12.134 33 16V34C33 34.5523 32.5523 35 32 35H8C7.44772 35 7 34.5523 7 34V16C7 12.134 10.134 9 14 9Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M16.7891 23H23.2109C24.7512 23.0002 25.9998 24.2488 26 25.7891V35H14V25.7891C14.0002 24.3451 15.0976 23.1577 16.5039 23.0146L16.7891 23Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M26 9V8C26 6.34315 24.6569 5 23 5H17C15.3431 5 14 6.34315 14 8V9"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M7 23L6 23C4.34315 23 3 21.6569 3 20C3 18.3431 4.34315 17 6 17L7 17"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M33 23L34 23C35.6569 23 37 21.6569 37 20C37 18.3431 35.6569 17 34 17L33 17"
        stroke={color}
        strokeWidth="2"
      />
      <circle cx="20" cy="29" r="1" stroke={color} strokeWidth="2" />
      <path d="M7 16H33" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default RiceCookerIcon;
