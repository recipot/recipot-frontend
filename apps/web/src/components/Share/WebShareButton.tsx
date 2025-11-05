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

    // User-Agent 기반 모바일 감지 (더 엄격하게)
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        userAgent
      );

    // 화면 크기 기반 감지 (추가 확인)
    const isSmallScreen =
      typeof window !== 'undefined' && window.innerWidth <= 768;

    // 터치 이벤트 지원 여부 (추가 확인)
    const hasTouchSupport =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - 일부 브라우저에서 지원
        navigator.msMaxTouchPoints > 0);

    // 모바일로 판단: User-Agent가 모바일이거나 (작은 화면이고 터치 지원)
    const result = isMobileUA || (isSmallScreen && hasTouchSupport);

    console.info('[WebShareButton] 모바일 감지 결과:', {
      hasTouchSupport,
      isMobileUA,
      isSmallScreen,
      result,
      userAgent,
      windowWidth:
        typeof window !== 'undefined' ? window.innerWidth : 'unknown',
    });

    return result;
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
    // 디버깅: 함수 진입 확인
    alert(
      `[디버그] handleWebShare 함수 진입\n\n카카오톡 인앱 브라우저: ${isKakaoTalkInAppBrowser()}\nonKakaoInAppClick 존재: ${!!onKakaoInAppClick}`
    );

    // 카카오톡 인앱 브라우저에서 접속한 경우 로그인 모달 표시
    if (onKakaoInAppClick && isKakaoTalkInAppBrowser()) {
      alert(`[디버그] 카카오톡 인앱 브라우저로 감지되어 로그인 모달 표시`);
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

      // 모바일에서도 확인할 수 있도록 디버깅 정보를 alert로 표시 (항상 표시)
      alert(
        `[디버그] 공유 시작\n\n모바일 감지: ${isMobile}\nWeb Share 지원: ${webShareSupported}\n화면 크기: ${typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px\nUser-Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 80) : 'unknown'}...`
      );

      // 모바일 기기: Web Share API만 사용 (시스템 공유 모달)
      // 모바일 감지를 더 엄격하게 체크
      if (isMobile) {
        // 모바일에서 디버깅: 모바일 분기 진입 확인 (항상 표시)
        alert(
          `[디버그] 모바일 분기 진입\n\nWeb Share 지원: ${webShareSupported}`
        );
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
            const errorInfo = {
              error: shareError,
              errorMessage:
                shareError instanceof Error
                  ? shareError.message
                  : String(shareError),
              errorName:
                shareError instanceof Error ? shareError.name : 'Unknown',
            };
            console.warn(
              '[WebShareButton] 모바일: Web Share API 실패:',
              errorInfo
            );

            // 모바일에서도 확인할 수 있도록 에러 메시지에 상세 정보 포함
            const errorMessage = `공유에 실패했습니다.\n\n에러: ${errorInfo.errorName}\n${errorInfo.errorMessage}\n\n모바일에서는 시스템 공유만 사용합니다.\n\n디버그 정보:\n- 모바일 감지: ${isMobile}\n- Web Share 지원: ${webShareSupported}`;

            // alert 표시 (모바일에서도 확인 가능)
            alert(
              `[디버그] Web Share API 실패\n\n에러: ${errorInfo.errorName}\n${errorInfo.errorMessage}\n\n모바일 감지: ${isMobile}\nWeb Share 지원: ${webShareSupported}`
            );

            useApiErrorModalStore.getState().showError({
              isFatal: false,
              message: errorMessage,
            });
            return;
          }
        } else {
          // 모바일에서 Web Share API가 지원되지 않는 경우 에러 표시
          const debugInfo = {
            hasNavigatorShare: 'share' in navigator,
            hostname: location.hostname,
            isSecureContext: window.isSecureContext,
            protocol: location.protocol,
            userAgent:
              typeof navigator !== 'undefined'
                ? navigator.userAgent
                : 'unknown',
          };
          console.warn(
            '[WebShareButton] 모바일: Web Share API 미지원',
            debugInfo
          );

          // 모바일에서도 확인할 수 있도록 상세 정보 포함
          const errorMessage = `공유 기능을 사용할 수 없습니다.\n\n시스템 공유 기능이 지원되지 않는 환경입니다.\n\n디버그 정보:\n- navigator.share 존재: ${debugInfo.hasNavigatorShare}\n- 보안 컨텍스트: ${debugInfo.isSecureContext}\n- 프로토콜: ${debugInfo.protocol}\n- 호스트: ${debugInfo.hostname}`;

          // alert 표시 (모바일에서도 확인 가능)
          alert(
            `[디버그] Web Share API 미지원\n\n모바일 감지: ${isMobile}\nnavigator.share 존재: ${debugInfo.hasNavigatorShare}\n보안 컨텍스트: ${debugInfo.isSecureContext}\n프로토콜: ${debugInfo.protocol}\n호스트: ${debugInfo.hostname}`
          );

          useApiErrorModalStore.getState().showError({
            isFatal: false,
            message: errorMessage,
          });
          return; // 모바일에서는 절대 카카오톡 공유로 넘어가지 않음
        }
      }

      // 데스크톱: 기존 로직 유지 (Web Share API → 카카오톡 공유 → 클립보드 복사)
      // 데스크톱 분기 진입 확인 (항상 표시)
      alert(
        `[디버그] 데스크톱 분기 진입\n\n모바일 감지: ${isMobile}\nWeb Share 지원: ${webShareSupported}\n이 분기로 진입하면 카카오톡 공유로 넘어갑니다.`
      );

      // 만약 모바일인데 여기로 왔다면 에러 표시하고 종료 (이론적으로는 발생하지 않아야 함)
      if (isMobile) {
        const debugInfo = {
          isMobile,
          userAgent:
            typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          webShareSupported,
          windowWidth:
            typeof window !== 'undefined' ? window.innerWidth : 'unknown',
        };
        console.error(
          '[WebShareButton] 오류: 모바일로 감지되었지만 데스크톱 분기로 진입했습니다!',
          debugInfo
        );

        // 모바일에서도 확인할 수 있도록 상세 정보 포함
        const errorMessage = `공유 오류 발생\n\n모바일로 감지되었지만 데스크톱 분기로 진입했습니다.\n\n디버그 정보:\n- 모바일 감지: ${isMobile}\n- Web Share 지원: ${webShareSupported}\n- 화면 크기: ${debugInfo.windowWidth}px\n- User-Agent: ${debugInfo.userAgent.substring(0, 80)}...`;

        // alert 표시 (모바일에서도 확인 가능)
        alert(
          `[디버그] 분기 오류!\n\n모바일로 감지되었지만 데스크톱 분기로 진입했습니다.\n\n모바일 감지: ${isMobile}\nWeb Share 지원: ${webShareSupported}\n화면 크기: ${debugInfo.windowWidth}px\nUser-Agent: ${debugInfo.userAgent.substring(0, 100)}...`
        );

        useApiErrorModalStore.getState().showError({
          isFatal: false,
          message: errorMessage,
        });
        return;
      }
      console.info('[WebShareButton] 데스크톱으로 감지됨, 폴백 로직 사용');
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
        alert(
          `[디버그] 카카오톡 공유 시도\n\nenableKakao: ${enableKakao}\nkakaoSDKReady: ${kakaoSDKReady}`
        );
        try {
          console.info('[WebShareButton] 데스크톱: 카카오톡 공유 시도');
          await handleKakaoShare();
          alert(`[디버그] 카카오톡 공유 성공`);
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
