import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  position?: 'top' | 'bottom' | 'card-bottom';
}

const TOAST_STYLE: React.CSSProperties = {
  backdropFilter: 'blur(12px)',
  background: '#5A616DCC',
};

const POSITION_CLASSES: Record<'card-bottom', string> = {
  // bottom: 'absolute bottom-5 left-1/2 z-50 -translate-x-1/2 transform',
  'card-bottom': 'fixed bottom-5 left-1/2 z-50 -translate-x-1/2 transform',
  // top: 'fixed top-24 left-1/2 z-50 -translate-x-1/2 transform',
};

export const Toast = ({ isVisible, message }: ToastProps) => {
  if (!isVisible) return null;

  const positionClass = POSITION_CLASSES['card-bottom'];

  return (
    <div className={positionClass}>
      <div className="h-11 w-[310px] rounded-xl px-6 py-3" style={TOAST_STYLE}>
        <div className="flex items-center justify-center">
          <p className="text-14sb text-center whitespace-nowrap text-white">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
