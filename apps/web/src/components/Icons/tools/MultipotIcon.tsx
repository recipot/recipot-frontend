import React from 'react';

const MultipotIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 20.4545V13H6V29C6 31.2091 7.79086 33 10 33H20"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M30.0391 9C31.6743 9 33 10.3257 33 11.9609C32.9999 12.5347 32.5348 12.9999 31.9609 13H6.03906C5.46524 12.9999 5.00008 12.5348 5 11.9609C5 10.3257 6.32574 9 7.96094 9H30.0391Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M21 9V7C21 5.89543 20.1046 5 19 5C17.8954 5 17 5.89543 17 7V9"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M20 24H34C34.5523 24 35 24.4477 35 25V33C35 34.6569 33.6569 36 32 36H22C20.3431 36 19 34.6569 19 33V25C19 24.4477 19.4477 24 20 24Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M34.0195 21C35.1133 21 36 21.8867 36 22.9805C36 23.5435 35.5435 24 34.9805 24H19.0195C18.4917 24 18.0572 23.5989 18.0049 23.085L18 22.9805L18.0098 22.7783C18.111 21.7795 18.9549 21 19.9805 21H34.0195Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M28 21V19.5C28 18.6716 27.3284 18 26.5 18C25.6716 18 25 18.6716 25 19.5V21"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M9.99512 25.005L9.99512 17.005"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MultipotIcon;
