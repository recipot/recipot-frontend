'use client';

import React, { useEffect, useState } from 'react';

import { isKakaoTalkInAppBrowser, shareKakao } from '@/lib/kakao';
import { useApiErrorModalStore } from '@/stores';
import type { KakaoShareData, ShareData } from '@/types/share.types';

interface WebShareButtonProps {
  webShareData: ShareData;
  children?: React.ReactNode;
  className?: string;
  fallbackText?: string;
  enableKakao?: boolean;
  kakaoShareData?: KakaoShareData;
  onKakaoInAppClick?: () => void;
  onShareSuccess?: (message: string, duration?: number) => void;
}

const WebShareButton: React.FC<WebShareButtonProps> = ({
  children,
  enableKakao = false,
  fallbackText = '공유하기',
  kakaoShareData,
  onKakaoInAppClick,
  onShareSuccess,
  webShareData,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  // 클라이언트에서만 브라우저 정보 확인
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsSupported('share' in navigator);
      setIsAndroid(/Android/i.test(navigator.userAgent));
    }
  }, []);

  const handleKakaoShare = async () => {
    if (!kakaoShareData?.url) {
      throw new Error('카카오 공유에 필요한 데이터가 부족합니다.');
    }

    const kakaoData = {
      description:
        kakaoShareData.description ?? '한끼부터 - 당신의 레시피 추천 서비스',
      imageUrl: kakaoShareData.imageUrl ?? '/recipeImage.png',
      title: kakaoShareData.title ?? '한끼부터',
      url: kakaoShareData.url,
    };

    await shareKakao(kakaoData);
  };

  const tryWebShareAPI = async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      await navigator.share(webShareData);
      return true; // 성공
    } catch (shareError) {
      // 사용자가 공유를 취소한 경우 (AbortError)는 그대로 종료
      if (shareError instanceof Error && shareError.name === 'AbortError') {
        return true; // 취소는 성공으로 간주 (에러 표시 안 함)
      }
      // 다른 에러인 경우 카카오톡 공유로 폴백
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유에 실패했습니다. 다시 시도해주세요.',
      });
      return false;
    }
  };

  const tryKakaoShare = async (): Promise<boolean> => {
    if (!enableKakao) {
      return false;
    }

    try {
      await handleKakaoShare();
      return true;
    } catch (kakaoError) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message:
          kakaoError instanceof Error
            ? kakaoError.message
            : '카카오톡 공유에 실패했습니다.\n링크를 복사하여 공유하세요.',
      });
      return false;
    }
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
      if (await tryWebShareAPI()) {
        return;
      }

      // 2. Web Share API 미지원 또는 실패 시 카카오톡 공유 시도
      if (await tryKakaoShare()) {
        return;
      }

      // 3. 최종 폴백: 클립보드 복사
      await handleFallbackShare();
    } catch {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유 중 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const showShareMessage = (message: string) => {
    if (onShareSuccess) {
      onShareSuccess(message);
    } else {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message,
      });
    }
  };

  const getManualCopyMessage = (shareText: string): string => {
    return isAndroid
      ? `공유할 내용:\n${shareText}\n\n위 내용을 복사하여 다른 앱에서 공유하세요.`
      : `공유할 내용:\n${shareText}\n\n위 내용을 복사하여 공유하세요.`;
  };

  const tryClipboardCopy = async (shareText: string): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      const message = isAndroid
        ? '링크가 클립보드에 복사되었습니다.\n다른 앱에서 붙여넣기하여 공유하세요.'
        : '링크가 클립보드에 복사되었습니다.';
      showShareMessage(message);
      return true;
    } catch (clipboardError) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message:
          clipboardError instanceof Error
            ? clipboardError.message
            : '클립보드 복사에 실패했습니다.\n링크를 수동으로 복사해주세요.',
      });
      return false;
    }
  };

  const handleFallbackShare = async (): Promise<void> => {
    // shareText 생성 시 빈 값 필터링하여 불필요한 줄바꿈 제거
    const shareParts = [
      webShareData.title,
      webShareData.text,
      webShareData.url,
    ].filter((part): part is string => Boolean(part));

    if (shareParts.length === 0) {
      useApiErrorModalStore.getState().showError({
        isFatal: false,
        message: '공유할 내용이 없습니다.',
      });
      return;
    }

    const shareText = shareParts.join('\n');

    // 클립보드 복사 시도
    const clipboardSuccess = await tryClipboardCopy(shareText);
    if (clipboardSuccess) {
      return;
    }

    // 클립보드 복사 실패 또는 미지원 시 수동 복사 안내
    const manualCopyMessage = getManualCopyMessage(shareText);
    showShareMessage(manualCopyMessage);
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
