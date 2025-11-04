import React from 'react';

const OnepotIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 18H32C32.5523 18 33 18.4477 33 19V32C33 33.6569 31.6569 35 30 35H10C8.34315 35 7 33.6569 7 32V19C7 18.4477 7.44772 18 8 18Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M31.0391 11C32.6743 11 34 12.3257 34 13.9609C33.9999 14.5347 33.5348 14.9999 32.9609 15H7.03906C6.46524 14.9999 6.00008 14.5348 6 13.9609C6 12.3257 7.32574 11 8.96094 11H31.0391Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M22 11V9C22 7.89543 21.1046 7 20 7C18.8954 7 18 7.89543 18 9V11"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M10.9951 30.005L10.9951 22.005"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OnepotIcon;
