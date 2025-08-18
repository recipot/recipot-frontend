import React from 'react';

interface KakaoIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const KakaoIcon: React.FC<KakaoIconProps> = ({ size = 24, ...props }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.0454 2.13043C5.60654 2.13043 2 5.43261 2 9.48043C2 12.037 3.47961 14.2739 5.60654 15.6587L5.05169 19.1739L8.47328 16.6174C8.93566 16.7239 9.49052 16.7239 9.95289 16.7239C14.3917 16.7239 17.9983 13.4217 17.9983 9.37391C18.0907 5.43261 14.4842 2.13043 10.0454 2.13043Z"
        fill="black"
      />
    </svg>
  );
};

export default KakaoIcon;
