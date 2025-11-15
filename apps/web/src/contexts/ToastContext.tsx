'use client';

import React, {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

interface ToastContextValue {
  hideToast: () => void;
  isVisible: boolean;
  message: string;
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (toastMessage: string, duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage(toastMessage);
    setIsVisible(true);

    // 자동으로 토스트 숨기기
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  const value: ToastContextValue = {
    hideToast,
    isVisible,
    message,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
