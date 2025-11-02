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

const POSITION_CLASSES: Record<'top' | 'bottom' | 'card-bottom', string> = {
  bottom: 'absolute bottom-5 left-1/2 z-50 -translate-x-1/2 transform',
  'card-bottom': 'flex justify-center',
  top: 'fixed top-24 left-1/2 z-50 -translate-x-1/2 transform',
};

export const Toast = ({
  isVisible,
  message,
  position = 'top',
}: ToastProps & { position?: 'top' | 'bottom' | 'card-bottom' }) => {
  if (!isVisible) return null;

  const positionClass = POSITION_CLASSES[position];

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
