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
    if (typeof navigator === 'undefined') {
      return false;
    }
    const { userAgent } = navigator;
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ) ||
      (typeof window !== 'undefined' && window.innerWidth <= 768)
    );
  };

  // Web Share API 지원 여부를 정확하게 체크하는 함수
  // canShare는 참고용으로만 사용하고, 실제 지원 여부만 확인
  const checkWebShareSupport = (): boolean => {
    // 클라이언트 환경이 아니면 false
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return false;
    }

    // navigator.share가 존재하는지 확인
    if (!('share' in navigator)) {
      return false;
    }

    // navigator.share가 실제 함수인지 확인
    if (typeof navigator.share !== 'function') {
      return false;
    }

    // HTTPS 또는 localhost 환경인지 확인 (Web Share API는 안전한 컨텍스트에서만 동작)
    const isSecureContext =
      window.isSecureContext ||
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      return false;
    }

    // 기본 지원 여부만 확인 (canShare는 참고용으로만 사용)
    return true;
  };

  // 클라이언트에서만 브라우저 정보 확인
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const supported = checkWebShareSupport();
      setIsAndroid(/Android/i.test(navigator.userAgent));

      // 디버깅 로그
      const isSecureContext =
        window.isSecureContext ||
        location.protocol === 'https:' ||
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1';

      const hasCanShare =
        'canShare' in navigator && typeof navigator.canShare === 'function';

      console.info('[WebShareButton] Web Share API 지원 여부:', {
        hasCanShare,
        hasNavigatorShare: 'share' in navigator,
        hostname: location.hostname,
        isFunction: typeof navigator.share === 'function',
        isMobile: isMobileDevice(),
        isSecureContext,
        protocol: location.protocol,
        supported,
      });
    }
  }, []);

  // 카카오 SDK 초기화 - 재시도 로직 추가
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

  const isWebShareSupported = (): boolean => {
    // 실제 호출 시점에 다시 한번 확인
    return checkWebShareSupport();
  };

  const handleKakaoShare = async () => {
    if (!kakaoShareData || !shareData.title || !shareData.url) {
      throw new Error('카카오 공유에 필요한 데이터가 부족합니다.');
    }

    const kakaoData = {
      description:
        kakaoShareData?.description ??
        shareData.text ??
        '한끼부터 - 당신의 레시피 추천 서비스',
      imageUrl: kakaoShareData?.imageUrl ?? '/recipeImage.png',
      title: kakaoShareData?.title ?? shareData.title ?? '한끼부터',
      url: shareData.url,
    };

    await shareKakao(kakaoData);
  };

  const handleWebShare = async () => {
    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (onKakaoInAppClick && isKakaoTalkInAppBrowser()) {
      onKakaoInAppClick();
      return;
    }

    setIsSharing(true);

    try {
      // 실제 호출 시점에 다시 한번 지원 여부 확인
      const webShareSupported = isWebShareSupported();
      const isMobile = isMobileDevice();

      // canShare는 참고용으로만 체크 (false여도 Web Share API를 시도)
      let canShareResult: boolean | null = null;
      if (
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        typeof navigator.canShare === 'function'
      ) {
        try {
          canShareResult = navigator.canShare(shareData);
        } catch (error) {
          console.warn('[WebShareButton] canShare() 호출 중 오류:', error);
        }
      }

      console.info('[WebShareButton] 공유 시도 시작:', {
        canShare: canShareResult,
        enableKakao,
        isMobile,
        kakaoSDKReady,
        webShareSupported,
      });

      // 모바일 기기: Web Share API만 사용 (시스템 공유 모달)
      if (isMobile) {
        if (webShareSupported) {
          try {
            console.info('[WebShareButton] 모바일: Web Share API 호출 시도:', {
              canShare: canShareResult,
              shareData,
            });
            await navigator.share(shareData);
            console.info('[WebShareButton] 모바일: Web Share API 성공');
            return; // 성공 시 종료
          } catch (shareError) {
            // 사용자가 공유를 취소한 경우 (AbortError)는 그대로 종료
            if (
              shareError instanceof Error &&
              shareError.name === 'AbortError'
            ) {
              console.info('[WebShareButton] 사용자가 공유 취소');
              return;
            }
            // 다른 에러인 경우 에러만 표시 (카카오톡 공유로 폴백하지 않음)
            console.warn('[WebShareButton] 모바일: Web Share API 실패:', {
              error: shareError,
              errorMessage:
                shareError instanceof Error
                  ? shareError.message
                  : String(shareError),
              errorName:
                shareError instanceof Error ? shareError.name : 'Unknown',
            });
            useApiErrorModalStore.getState().showError({
              isFatal: false,
              message: '공유에 실패했습니다. 다시 시도해주세요.',
            });
            return;
          }
        } else {
          // 모바일에서 Web Share API가 지원되지 않는 경우 에러 표시
          console.warn('[WebShareButton] 모바일: Web Share API 미지원');
          useApiErrorModalStore.getState().showError({
            isFatal: false,
            message: '공유 기능을 사용할 수 없습니다.',
          });
          return;
        }
      }

      // 데스크톱: 기존 로직 유지 (Web Share API → 카카오톡 공유 → 클립보드 복사)
      // 1. Web Share API 먼저 시도
      if (webShareSupported) {
        try {
          console.info('[WebShareButton] 데스크톱: Web Share API 호출 시도:', {
            canShare: canShareResult,
            shareData,
          });
          await navigator.share(shareData);
          console.info('[WebShareButton] 데스크톱: Web Share API 성공');
          return; // 성공 시 종료
        } catch (shareError) {
          // 사용자가 공유를 취소한 경우 (AbortError)는 그대로 종료
          if (shareError instanceof Error && shareError.name === 'AbortError') {
            console.info('[WebShareButton] 사용자가 공유 취소');
            return;
          }
          // 다른 에러인 경우 카카오톡 공유로 폴백
          console.warn('[WebShareButton] 데스크톱: Web Share API 실패:', {
            error: shareError,
            errorMessage:
              shareError instanceof Error
                ? shareError.message
                : String(shareError),
            errorName:
              shareError instanceof Error ? shareError.name : 'Unknown',
          });
        }
      } else {
        console.info(
          '[WebShareButton] 데스크톱: Web Share API 미지원, 카카오톡 공유로 진행'
        );
      }

      // 2. Web Share API 미지원 또는 실패 시 카카오톡 공유 시도
      if (enableKakao && kakaoSDKReady) {
        try {
          console.info('[WebShareButton] 데스크톱: 카카오톡 공유 시도');
          await handleKakaoShare();
          console.info('[WebShareButton] 데스크톱: 카카오톡 공유 성공');
          return;
        } catch (kakaoError) {
          console.warn(
            '[WebShareButton] 데스크톱: 카카오 공유 실패, 클립보드 복사로 폴백:',
            kakaoError
          );
          // 카카오 공유 실패 시 클립보드 복사로 폴백
        }
      }

      // 3. 최종 폴백: 클립보드 복사
      console.info('[WebShareButton] 데스크톱: 클립보드 복사로 폴백');
      handleFallbackShare();
    } catch (error) {
      console.error('[WebShareButton] 공유 중 오류 발생:', error);
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
            // 추후 토스트 메시지로 alert 대체 예정
            alert(
              'Android에서 공유: 링크가 클립보드에 복사되었습니다.\n다른 앱에서 붙여넣기하여 공유하세요.'
            );
          } else {
            alert('링크가 클립보드에 복사되었습니다.');
          }
        })
        .catch(error => {
          console.error('클립보드 복사 실패:', error);
          if (error instanceof Error) {
            console.error('클립보드 복사 실패:', error);
          }
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
