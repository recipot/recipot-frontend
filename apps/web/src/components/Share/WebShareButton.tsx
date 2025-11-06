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
 */
const isShareSupported = (): boolean => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  // navigator.share 존재 여부 확인
  if (!('share' in navigator) || typeof navigator.share !== 'function') {
    return false;
  }

  // HTTPS 또는 localhost 환경인지 확인 (Web Share API는 안전한 컨텍스트에서만 동작)
  return (
    window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  );
};

/**
 * shareData 검증 - navigator.share()는 최소한 하나의 필드가 필요
 */
const validateShareData = (data: ShareData): boolean => {
  const hasTitle = Boolean(data.title?.trim());
  const hasText = Boolean(data.text?.trim());
  const hasUrl = Boolean(data.url?.trim());

  return hasTitle || hasText || hasUrl;
};

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  className,
  fallbackText = '공유하기',
  shareData,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  // shareData 정리 (빈 문자열 제거)
  const cleanShareData = (data: ShareData): ShareData => {
    const cleaned: ShareData = {};
    if (data.title?.trim()) {
      cleaned.title = data.title.trim();
    }
    if (data.text?.trim()) {
      cleaned.text = data.text.trim();
    }
    if (data.url?.trim()) {
      cleaned.url = data.url.trim();
    }
    return cleaned;
  };

  // Web Share API를 통한 공유 시도
  const tryWebShare = async (data: ShareData): Promise<boolean> => {
    if (!isShareSupported() || !validateShareData(data)) {
      return false;
    }

    const cleaned = cleanShareData(data);
    if (!validateShareData(cleaned)) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유할 데이터가 없습니다.',
      });
      return false;
    }

    try {
      await navigator.share(cleaned);
      return true;
    } catch (error) {
      // 사용자가 공유를 취소한 경우는 정상 종료
      if (error instanceof Error && error.name === 'AbortError') {
        return true;
      }
      return false;
    }
  };

  // 클립보드 복사 폴백
  const tryClipboardFallback = async (url: string): Promise<boolean> => {
    const success = await copyToClipboard(url);
    if (success) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '링크가 클립보드에 복사되었습니다.',
      });
      return true;
    }
    return false;
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // 1. Web Share API 시도
      const webShareSuccess = await tryWebShare(shareData);
      if (webShareSuccess) {
        return;
      }

      // 2. 클립보드 복사 폴백
      if (shareData.url) {
        const clipboardSuccess = await tryClipboardFallback(shareData.url);
        if (clipboardSuccess) {
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
