'use client';

import React, { useState } from 'react';

import copyToClipboard from '@/lib/copyToClipboard';
import { useApiErrorModalStore } from '@/stores';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface WebShareButtonProps {
  shareData: ShareData;
  children?: React.ReactNode;
  className?: string;
  fallbackText?: string;
}

/**
 * Web Share API 지원 여부 확인
 * 참고: https://velog.io/@otterji/navigation.share-copyClipboard
 */
const isShareSupported = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return Boolean(navigator.share);
};

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  className,
  fallbackText = '공유하기',
  shareData,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // 1. Web Share API 시도
      if (isShareSupported()) {
        try {
          await navigator.share(shareData);
          // 성공 시 추가 처리 불필요
          return;
        } catch (error) {
          // 사용자가 공유를 취소한 경우 (AbortError)는 정상 종료로 처리
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }
          // 다른 에러는 클립보드 복사로 폴백
        }
      }

      // 2. 클립보드 복사 폴백
      if (shareData.url) {
        const success = await copyToClipboard(shareData.url);
        if (success) {
          useApiErrorModalStore.getState().showError({
            isFatal: false,
            message: '링크가 클립보드에 복사되었습니다.',
          });
          return;
        }
      }

      // 3. 모든 방법 실패
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유 기능을 사용할 수 없습니다.',
      });
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={className}
      aria-label="공유하기"
    >
      {children ?? fallbackText}
    </button>
  );
};

export default WebShareButton;
