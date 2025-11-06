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
  const [isSupported, setIsSupported] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [kakaoSDKReady, setKakaoSDKReady] = useState(false);

  // 클라이언트에서만 브라우저 정보 확인
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsSupported('share' in navigator);
      setIsAndroid(/Android/i.test(navigator.userAgent));
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

  const isWebShareSupported = () => {
    return isSupported;
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
      // 1. Web Share API 먼저 시도 (시스템 공유 모달)
      if (isWebShareSupported()) {
        try {
          await navigator.share(shareData);
          return; // 성공 시 종료
        } catch (shareError) {
          // 사용자가 공유를 취소한 경우 (AbortError)는 그대로 종료
          if (shareError instanceof Error && shareError.name === 'AbortError') {
            return;
          }
          // 다른 에러인 경우 카카오톡 공유로 폴백
          useApiErrorModalStore.getState().showError({
            isFatal: false,
            message: '공유에 실패했습니다. 다시 시도해주세요.',
          });
        }
      }

      // 2. Web Share API 미지원 또는 실패 시 카카오톡 공유 시도
      if (enableKakao && kakaoSDKReady) {
        try {
          await handleKakaoShare();
          return;
        } catch (kakaoError) {
          console.warn(
            '[WebShareButton] 카카오 공유 실패, 클립보드 복사로 폴백:',
            kakaoError
          );
          // 카카오 공유 실패 시 클립보드 복사로 폴백
        }
      }

      // 3. 최종 폴백: 클립보드 복사
      handleFallbackShare();
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
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
