import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast = ({ isVisible, message }: ToastProps) => {
  if (!isVisible) return null;

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
          <p className="text-14sb text-center whitespace-nowrap text-white">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
