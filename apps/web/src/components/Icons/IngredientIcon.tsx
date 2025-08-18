import React from 'react';

interface IngredientIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const IngredientIcon: React.FC<IngredientIconProps> = ({ color = '#68982D', size = 24, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.6666 8.33332C18.3333 10.8333 14.1666 18.3333 12.5 18.3333C10.8333 18.3333 10.8333 17.5 9.99997 17.5C9.16664 17.5 9.16664 18.3333 7.49997 18.3333C5.83331 18.3333 1.66664 10.8333 3.33331 8.33332C4.99997 5.83332 7.49997 5.83332 9.16664 6.66666V4.16666C4.48331 6.72499 3.42497 3.14999 3.42497 3.14999C3.42497 3.14999 5.64164 0.158325 9.16664 4.16666V2.49999H10.8333V6.66666C12.5 5.83332 15 5.83332 16.6666 8.33332Z"
        fill={color}
      />
    </svg>
  );
};

export default IngredientIcon;
