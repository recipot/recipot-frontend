import React from 'react';

import { CookwareIcon, HeartIcon } from '@/components/Icons';
import RecipeWareIcon from '@/components/Icons/RecipeWareIcon';

interface ToastProps {
  message: string;
  isVisible: boolean;
  icon?: 'heart' | 'recipe';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  icon = 'recipe',
  isVisible,
  message,
}) => {
  if (!isVisible) return null;

  const renderIcon = () => {
    switch (icon) {
      case 'heart':
        return <HeartIcon className="h-4 w-4" active color="#FFB8D2" />;
      case 'recipe':
        return <RecipeWareIcon className="h-4 w-4" color="#FFFFFF" />;
      default:
        return <CookwareIcon className="h-4 w-4" color="#FFB8D2" />;
    }
  };

  // 메시지에 따른 너비 설정
  const getToastWidth = () => {
    if (message === '레시피가 저장되었어요') {
      return 'w-[196px]';
    } else if (message === '새로운 레시피가 추천되었어요') {
      return 'w-[238px]';
    }
    return 'w-[196px]'; // 기본값
  };

  return (
    <div className="fixed top-24 left-1/2 z-50 -translate-x-1/2 transform">
      <div
        className={`h-11 ${getToastWidth()} rounded-xl bg-black/60 px-6 py-3`}
      >
        <div className="flex items-center justify-center">
          <div className="mr-2 flex h-4 w-4 items-center justify-center">
            {renderIcon()}
          </div>
          <p className="text-14sb text-center whitespace-nowrap text-white">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
