import React from 'react';

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const UserIcon: React.FC<UserIconProps> = ({ color = '#868E96', size = 24, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <g clipPath="url(#clip0_1248_12101)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4ZM7 7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2 20C2 16.0308 5.58106 13 9.75 13H14.25C18.4189 13 22 16.0308 22 20V21C22 21.5523 21.5523 22 21 22C20.4477 22 20 21.5523 20 21V20C20 17.3492 17.5411 15 14.25 15H9.75C6.45894 15 4 17.3492 4 20V21C4 21.5523 3.55228 22 3 22C2.44772 22 2 21.5523 2 21V20Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1248_12101">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UserIcon;
