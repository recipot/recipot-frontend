import React from 'react';

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ color = '#868E96', size = 24, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2021 5.67187C7.21512 6.1568 5.18676 8.9717 5.67161 11.9591C6.15646 14.9465 8.97093 16.9752 11.9579 16.4903C14.9448 16.0054 16.9732 13.1905 16.4884 10.203C16.0035 7.21562 13.189 5.18694 10.2021 5.67187ZM4.09253 12.2155C3.46611 8.35582 6.08669 4.71905 9.94576 4.09254C13.8048 3.46603 17.441 6.08702 18.0674 9.94668C18.6939 13.8063 16.0733 17.4431 12.2142 18.0696C8.35514 18.6961 4.71894 16.0751 4.09253 12.2155Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.227 15.2263C15.5394 14.9139 16.0459 14.9139 16.3582 15.2263L19.7657 18.6343C20.0781 18.9467 20.0781 19.4533 19.7657 19.7657C19.4534 20.0781 18.9469 20.0781 18.6345 19.7657L15.227 16.3577C14.9147 16.0453 14.9147 15.5387 15.227 15.2263Z"
        fill={color}
      />
    </svg>
  );
};

export default SearchIcon;
