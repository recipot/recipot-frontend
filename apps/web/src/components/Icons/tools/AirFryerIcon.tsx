import React from 'react';

const AirFryerIcon = ({ color = '#212529', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 5H22C28.0751 5 33 9.92487 33 16V26C33 29.866 29.866 33 26 33H14C10.134 33 7 29.866 7 26V16C7 9.92487 11.9249 5 18 5Z"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M18 22L18 26.711C18 27.2633 18.4477 27.711 19 27.711L21 27.711C21.5523 27.711 22 27.2633 22 26.711L22 22"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M26 6L24.4178 15.4932C24.1767 16.9398 22.9251 18 21.4586 18H18.5414C17.0749 18 15.8233 16.9398 15.5822 15.4932L14 6"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M16 33V34C16 34.5523 15.5523 35 15 35C14.4477 35 14 34.5523 14 34V33"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M26 33V34C26 34.5523 25.5523 35 25 35C24.4477 35 24 34.5523 24 34V33"
        stroke={color}
        strokeWidth="2"
      />
      <circle cx="20" cy="13" r="1" stroke={color} strokeWidth="2" />
      <path d="M7 22H33" stroke={color} strokeWidth="2" />
    </svg>
  );
};

export default AirFryerIcon;
