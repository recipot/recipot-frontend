'use client';

import React, { useEffect, useState } from 'react';

import { initKakao, isKakaoSDKLoaded, shareKakao } from '@/lib/kakao';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface KakaoShareData {
  imageUrl?: string;
}

interface WebShareButtonProps {
  shareData: ShareData;
  children?: React.ReactNode;
  className?: string;
  fallbackText?: string;
  enableKakao?: boolean;
  kakaoShareData?: KakaoShareData;
}

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  enableKakao = false,
  fallbackText = '공유하기',
  kakaoShareData,
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
      description: shareData.text ?? '한끼부터 - 당신의 레시피 추천 서비스',
      imageUrl: kakaoShareData.imageUrl ?? '/recipeImage.png',
      title: shareData.title,
      url: shareData.url,
    };

    await shareKakao(kakaoData);
  };

  const handleWebShare = async () => {
    setIsSharing(true);

    try {
      // 1. 카카오 공유가 활성화되고 준비된 경우 우선 실행
      if (enableKakao && kakaoSDKReady) {
        try {
          await handleKakaoShare();
          return;
        } catch (kakaoError) {
          console.warn(
            '[WebShareButton] 카카오 공유 실패, Web Share API로 폴백:',
            kakaoError
          );
          // 카카오 공유 실패 시 Web Share API로 폴백
        }
      }

      // 2. Web Share API 지원 확인
      if (isWebShareSupported()) {
        await navigator.share(shareData);
        return;
      }

      // 3. 폴백: 클립보드 복사
      handleFallbackShare();
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('공유 중 오류 발생:', error);
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
