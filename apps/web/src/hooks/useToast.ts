import { useRef, useState } from 'react';

interface UseToastReturn {
  isVisible: boolean;
  message: string;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
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

  return {
    hideToast,
    isVisible,
    message,
    showToast,
  };
};
