'use client';

import { useCallback, useEffect, useState } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface UseWebShareReturn {
  isSupported: boolean;
  isSharing: boolean;
  share: (data: ShareData) => Promise<void>;
  shareError: Error | null;
}

export const useWebShare = (): UseWebShareReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<Error | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // 클라이언트에서만 지원 여부 확인
  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const share = useCallback(
    async (data: ShareData) => {
      if (!isSupported) {
        throw new Error('Web Share API가 지원되지 않습니다.');
      }

      setIsSharing(true);
      setShareError(null);

      try {
        await navigator.share(data);
      } catch (error) {
        if (error instanceof Error) {
          setShareError(error);
          throw error;
        }
      } finally {
        setIsSharing(false);
      }
    },
    [isSupported]
  );

  return {
    isSharing,
    isSupported,
    share,
    shareError,
  };
};
