'use client';

import React, { useEffect, useState } from 'react';

import {
  initKakao,
  isKakaoSDKLoaded,
  isKakaoTalkInAppBrowser,
  shareKakao,
} from '@/lib/kakao';
import { useApiErrorModalStore } from '@/stores';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface KakaoShareData {
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface WebShareButtonProps {
  shareData: ShareData;
  children?: React.ReactNode;
  className?: string;
  fallbackText?: string;
  enableKakao?: boolean;
  kakaoShareData?: KakaoShareData;
  onKakaoInAppClick?: () => void;
}

/**
 * 모바일 기기인지 확인
 */
const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    navigator.userAgent
  );
};

/**
 * Web Share API 지원 여부 확인
 * 모바일에서는 시스템 공유 모달이 지원되는지 확인
 */
const isWebShareSupported = (): boolean => {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }

  // navigator.share가 존재하고 함수인지 확인
  if (!('share' in navigator) || typeof navigator.share !== 'function') {
    return false;
  }

  // 안전한 컨텍스트(HTTPS 또는 localhost)인지 확인
  return (
    window.isSecureContext ||
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  );
};

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  enableKakao = false,
  fallbackText = '공유하기',
  kakaoShareData,
  onKakaoInAppClick,
  shareData,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [kakaoSDKReady, setKakaoSDKReady] = useState(false);

  // 브라우저 정보 확인
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsAndroid(/Android/i.test(navigator.userAgent));
    }
  }, []);

  // 카카오 SDK 초기화
  useEffect(() => {
    if (enableKakao && typeof window !== 'undefined') {
      let retryCount = 0;
      const maxRetries = 30; // 최대 3초 대기

      const checkKakaoSDK = () => {
        if (isKakaoSDKLoaded()) {
          const initialized = initKakao();
          if (initialized) {
            setKakaoSDKReady(true);
          }
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkKakaoSDK, 100);
        }
      };

      checkKakaoSDK();
    }
  }, [enableKakao]);

  /**
   * 카카오톡 공유 실행
   * 레시피 상세 API에서 받아온 데이터 사용
   */
  const handleKakaoShare = async () => {
    if (!kakaoShareData || !shareData.title || !shareData.url) {
      throw new Error('카카오 공유에 필요한 데이터가 부족합니다.');
    }

    // 레시피 상세 API에서 받아온 데이터 우선 사용
    const kakaoData = {
      description:
        kakaoShareData.description ??
        shareData.text ??
        '한끼부터 - 당신의 레시피 추천 서비스',
      imageUrl: kakaoShareData.imageUrl ?? '/recipeImage.png',
      title: kakaoShareData.title ?? shareData.title ?? '한끼부터',
      url: shareData.url,
    };

    await shareKakao(kakaoData);
  };

  /**
   * 모바일에서 시스템 공유 모달 사용
   */
  const handleMobileShare = async (): Promise<boolean> => {
    const webShareSupported = isWebShareSupported();

    if (!webShareSupported) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message:
          '공유 기능을 사용할 수 없습니다.\n시스템 공유 기능이 지원되지 않는 환경입니다.',
      });
      return false;
    }

    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // 사용자가 공유를 취소한 경우는 정상 동작
      if (error instanceof Error && error.name === 'AbortError') {
        return true;
      }

      // 다른 에러인 경우
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유에 실패했습니다.\n잠시 후 다시 시도해주세요.',
      });
      return false;
    }
  };

  /**
   * 데스크톱에서 공유 (Web Share API → 카카오톡 → 클립보드)
   */
  const handleDesktopShare = async (): Promise<void> => {
    // 1. Web Share API 시도
    if (isWebShareSupported()) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // 사용자가 공유를 취소한 경우 종료
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        // 다른 에러인 경우 다음 단계로 진행
      }
    }

    // 2. 카카오톡 공유 시도
    if (enableKakao && kakaoSDKReady) {
      try {
        await handleKakaoShare();
        return;
      } catch (error) {
        console.warn('[WebShareButton] 카카오 공유 실패:', error);
        // 클립보드 복사로 폴백
      }
    }

    // 3. 클립보드 복사
    handleClipboardCopy();
  };

  /**
   * 클립보드 복사
   */
  const handleClipboardCopy = () => {
    const shareText =
      `${shareData.title ?? ''}\n${shareData.text ?? ''}\n${shareData.url ?? ''}`.trim();

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert(
            isAndroid
              ? '링크가 클립보드에 복사되었습니다.\n다른 앱에서 붙여넣기하여 공유하세요.'
              : '링크가 클립보드에 복사되었습니다.'
          );
        })
        .catch(() => {
          alert(`공유할 내용: ${shareText}`);
        });
    } else {
      alert(`공유할 내용: ${shareText}`);
    }
  };

  /**
   * 공유 버튼 클릭 핸들러
   */
  const handleWebShare = async () => {
    // 카카오톡 인앱 브라우저에서 접속한 경우
    if (onKakaoInAppClick && isKakaoTalkInAppBrowser()) {
      onKakaoInAppClick();
      return;
    }

    setIsSharing(true);

    try {
      const isMobile = isMobileDevice();

      if (isMobile) {
        // 모바일: 시스템 공유 모달만 사용
        await handleMobileShare();
      } else {
        // 데스크톱: Web Share API → 카카오톡 → 클립보드 순서
        await handleDesktopShare();
      }
    } catch (error) {
      console.error('[WebShareButton] 공유 중 오류 발생:', error);
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleWebShare}
      disabled={isSharing}
      className="hover:cursor-pointer disabled:cursor-not-allowed"
    >
      {children ?? fallbackText}
    </button>
  );
};

export default WebShareButton;
