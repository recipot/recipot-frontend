import React from 'react';

interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ color = '#868E96', size = 18, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 5.5L11 9.5L7 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ArrowIcon;
