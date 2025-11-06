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

  // shareData 검증 - navigator.share()는 최소한 하나의 필드가 필요
  const validateShareData = (): boolean => {
    const hasTitle = Boolean(shareData.title?.trim());
    const hasText = Boolean(shareData.text?.trim());
    const hasUrl = Boolean(shareData.url?.trim());

    return hasTitle || hasText || hasUrl;
  };

  // Web Share API 시도 (사용자 취소는 무시)
  const tryWebShare = async (showDebugInfo = false): Promise<boolean> => {
    if (!checkWebShareSupport()) {
      const debugMsg = showDebugInfo
        ? `\n\n[디버그 정보]\n- navigator.share 존재: ${'share' in navigator}\n- 함수 타입: ${typeof navigator.share}\n- 보안 컨텍스트: ${window.isSecureContext}\n- 프로토콜: ${location.protocol}\n- 호스트: ${location.hostname}`
        : '';
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유 기능을 사용할 수 없습니다.\n시스템 공유 기능이 지원되지 않는 환경입니다.${debugMsg}`,
      });
      return false;
    }

    // shareData 검증
    if (!validateShareData()) {
      const debugMsg = showDebugInfo
        ? `\n\n[디버그 정보]\n- shareData: ${JSON.stringify(shareData, null, 2)}`
        : '';
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유할 데이터가 없습니다.${debugMsg}`,
      });
      return false;
    }

    // navigator.share()에 전달할 데이터 정리 (빈 문자열 제거)
    const cleanShareData: ShareData = {};
    if (shareData.title?.trim()) {
      cleanShareData.title = shareData.title.trim();
    }
    if (shareData.text?.trim()) {
      cleanShareData.text = shareData.text.trim();
    }
    if (shareData.url?.trim()) {
      cleanShareData.url = shareData.url.trim();
    }

    // 최소한 하나의 필드가 있는지 재확인
    if (!validateShareData()) {
      const debugMsg = showDebugInfo
        ? `\n\n[디버그 정보]\n- 정리된 shareData: ${JSON.stringify(cleanShareData, null, 2)}`
        : '';
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유할 데이터가 없습니다.${debugMsg}`,
      });
      return false;
    }

    try {
      await navigator.share(cleanShareData);
      return true;
    } catch (error) {
      // 사용자가 공유를 취소한 경우 (AbortError)는 정상 종료로 처리
      if (error instanceof Error && error.name === 'AbortError') {
        return true;
      }
      // 다른 에러는 모달로 표시
      const errorName = error instanceof Error ? error.name : 'Unknown';
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const debugMsg = showDebugInfo
        ? `\n\n[디버그 정보]\n- 에러 이름: ${errorName}\n- 에러 메시지: ${errorMessage}\n- shareData: ${JSON.stringify(cleanShareData, null, 2)}`
        : `\n\n에러: ${errorName}\n${errorMessage}`;
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유에 실패했습니다.${debugMsg}`,
      });
      return false;
    }
  };

  // 모바일 공유 처리
  const handleMobileShare = async (): Promise<void> => {
    const webShareSupported = checkWebShareSupport();
    const shareDataValid = validateShareData();

    // 모바일에서는 디버깅 정보를 모달로 표시
    const debugInfo = `\n\n[디버그 정보]\n- 모바일 감지: true\n- Web Share 지원: ${webShareSupported}\n- shareData 유효: ${shareDataValid}\n- 보안 컨텍스트: ${window.isSecureContext}\n- 프로토콜: ${location.protocol}\n- 호스트: ${location.hostname}\n- navigator.share 존재: ${'share' in navigator}\n- shareData: ${JSON.stringify(shareData, null, 2)}`;

    if (!webShareSupported) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유 기능을 사용할 수 없습니다.\n시스템 공유 기능이 지원되지 않는 환경입니다.${debugInfo}`,
      });
      return;
    }

    if (!shareDataValid) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유할 데이터가 없습니다.${debugInfo}`,
      });
      return;
    }

    // 모바일에서는 디버깅 정보 표시
    const success = await tryWebShare(true);
    if (!success) {
      // tryWebShare에서 이미 에러 모달을 표시했으므로 여기서는 추가 처리 불필요
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
    // 초기 상태 확인 (모바일에서는 항상 디버깅 정보 표시)
    const isMobile = isMobileDevice();
    const webShareSupported = checkWebShareSupport();
    const shareDataValid = validateShareData();
    const isKakaoInApp = isKakaoTalkInAppBrowser();

    // 모바일에서는 함수 호출 시점에 즉시 디버깅 정보 표시
    if (isMobile) {
      const initialDebugInfo = `\n\n[초기 디버깅 정보]\n- 함수 호출: 성공\n- 모바일 감지: ${isMobile}\n- Web Share 지원: ${webShareSupported}\n- shareData 유효: ${shareDataValid}\n- 카카오톡 인앱: ${isKakaoInApp}\n- 보안 컨텍스트: ${window.isSecureContext}\n- 프로토콜: ${location.protocol}\n- 호스트: ${location.hostname}\n- navigator.share 존재: ${'share' in navigator}\n- shareData: ${JSON.stringify(shareData, null, 2)}`;

      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유 기능 실행 중...${initialDebugInfo}`,
      });
    }

    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (onKakaoInAppClick && isKakaoInApp) {
      onKakaoInAppClick();
      return;
    }

    setIsSharing(true);

    try {
      if (isMobile) {
        await handleMobileShare();
      } else {
        await handleDesktopShare();
      }
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'Unknown';
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      const debugInfo = isMobile
        ? `\n\n[예외 발생 디버그 정보]\n- 에러 이름: ${errorName}\n- 에러 메시지: ${errorMessage}\n- 스택: ${stack ?? '없음'}\n- 모바일 감지: ${isMobile}\n- Web Share 지원: ${checkWebShareSupport()}\n- shareData 유효: ${validateShareData()}`
        : `\n\n에러: ${errorName}\n${errorMessage}`;

      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: `공유 중 오류가 발생했습니다.${debugInfo}`,
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
