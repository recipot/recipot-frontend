'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface WebShareButtonProps {
  shareData: ShareData;
  children?: React.ReactNode;
  className?: string;
  onShareSuccess?: () => void;
  onShareError?: (error: Error) => void;
  fallbackText?: string;
}

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  className,
  fallbackText = '공유하기',
  onShareError,
  onShareSuccess,
  shareData,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  // 클라이언트에서만 브라우저 정보 확인
  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsSupported('share' in navigator);
      setIsAndroid(/Android/i.test(navigator.userAgent));
    }
  }, []);

  const isWebShareSupported = () => {
    return isSupported;
  };

  const handleWebShare = async () => {
    if (!isWebShareSupported()) {
      // Web Share API가 지원되지 않는 경우 폴백
      handleFallbackShare();
      return;
    }

    setIsSharing(true);

    try {
      await navigator.share(shareData);
      onShareSuccess?.();
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('공유 중 오류 발생:', error);
        onShareError?.(error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleFallbackShare = () => {
    // Web Share API가 지원되지 않는 경우 클립보드에 복사
    const shareText =
      `${shareData.title ?? ''}\n${shareData.text ?? ''}\n${shareData.url ?? ''}`.trim();

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          if (isAndroid) {
            alert(
              'Android에서 공유: 링크가 클립보드에 복사되었습니다.\n다른 앱에서 붙여넣기하여 공유하세요.'
            );
          } else {
            alert('링크가 클립보드에 복사되었습니다.');
          }
          onShareSuccess?.();
        })
        .catch(error => {
          console.error('클립보드 복사 실패:', error);
          onShareError?.(error);
        });
    } else {
      // 클립보드 API도 지원되지 않는 경우
      if (isAndroid) {
        alert(
          `Android 공유: ${shareText}\n\n이 내용을 복사하여 다른 앱에서 공유하세요.`
        );
      } else {
        alert(`공유할 내용: ${shareText}`);
      }
      onShareSuccess?.();
    }
  };

  return (
    <Button
      onClick={handleWebShare}
      disabled={isSharing}
      className={className}
      variant="default"
    >
      {isSharing ? '공유 중...' : (children ?? fallbackText)}
    </Button>
  );
};

export default WebShareButton;
