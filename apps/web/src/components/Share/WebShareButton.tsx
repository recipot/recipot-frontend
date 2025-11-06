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

  // 모바일 환경인지 확인하는 함수
  const isMobileDevice = (): boolean => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return false;
    }

    const { userAgent } = navigator;
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        userAgent
      );

    const isSmallScreen = window.innerWidth <= 768;
    const hasTouchSupport =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - 일부 브라우저에서 지원
      navigator.msMaxTouchPoints > 0;

    return isMobileUA || (isSmallScreen && hasTouchSupport);
  };

  // Web Share API 지원 여부 확인
  // 모바일 기기에서 시스템 공유 모달 지원 여부를 확인
  const checkWebShareSupport = (): boolean => {
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

  // 클라이언트에서만 브라우저 정보 확인
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

  // 카카오톡 공유 실행
  // 레시피 상세 API에서 받아온 이미지, 제목, 설명을 사용
  const handleKakaoShare = async () => {
    if (!kakaoShareData || !shareData.title || !shareData.url) {
      throw new Error('카카오 공유에 필요한 데이터가 부족합니다.');
    }

    // 레시피 상세 API 데이터 우선 사용
    const kakaoData = {
      description: kakaoShareData.description ?? shareData.text ?? '',
      imageUrl: kakaoShareData.imageUrl ?? '/recipeImage.png',
      title: kakaoShareData.title ?? shareData.title ?? '',
      url: shareData.url,
    };

    await shareKakao(kakaoData);
  };

  // Web Share API 시도 (사용자 취소는 무시)
  const tryWebShare = async (): Promise<boolean> => {
    if (!checkWebShareSupport()) {
      return false;
    }

    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // 사용자가 공유를 취소한 경우 (AbortError)는 정상 종료로 처리
      if (error instanceof Error && error.name === 'AbortError') {
        return true;
      }
      return false;
    }
  };

  // 모바일 공유 처리
  const handleMobileShare = async (): Promise<void> => {
    const webShareSupported = checkWebShareSupport();

    if (!webShareSupported) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message:
          '공유 기능을 사용할 수 없습니다.\n시스템 공유 기능이 지원되지 않는 환경입니다.',
      });
      return;
    }

    const success = await tryWebShare();
    if (!success) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유에 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  // 데스크톱 공유 처리 (Web Share API → 카카오톡 공유 → 클립보드 복사)
  const handleDesktopShare = async (): Promise<void> => {
    // 1. Web Share API 시도
    const webShareSuccess = await tryWebShare();
    if (webShareSuccess) {
      return;
    }

    // 2. 카카오톡 공유 시도
    if (enableKakao && kakaoSDKReady) {
      try {
        await handleKakaoShare();
        return;
      } catch {
        // 카카오 공유 실패 시 클립보드 복사로 폴백
      }
    }

    // 3. 최종 폴백: 클립보드 복사
    handleFallbackShare();
  };

  const handleWebShare = async () => {
    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (onKakaoInAppClick && isKakaoTalkInAppBrowser()) {
      onKakaoInAppClick();
      return;
    }

    setIsSharing(true);

    try {
      const isMobile = isMobileDevice();

      if (isMobile) {
        await handleMobileShare();
      } else {
        await handleDesktopShare();
      }
    } catch (error) {
      console.error('[WebShareButton] 공유 중 오류 발생:', error);
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleFallbackShare = () => {
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
        .catch(error => {
          console.error('클립보드 복사 실패:', error);
          alert(
            isAndroid
              ? `링크: ${shareText}\n\n이 내용을 복사하여 다른 앱에서 공유하세요.`
              : `공유할 내용: ${shareText}`
          );
        });
    } else {
      alert(
        isAndroid
          ? `링크: ${shareText}\n\n이 내용을 복사하여 다른 앱에서 공유하세요.`
          : `공유할 내용: ${shareText}`
      );
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
