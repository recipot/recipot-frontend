'use client';

import React, { useEffect, useState } from 'react';

import { useWebShare } from '@/hooks/useWebShare';

import { ShareIcon } from '../Icons';

const SimpleShareTest: React.FC = () => {
  const { isSharing, isSupported, share } = useWebShare();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleShare = async () => {
    try {
      const shareData = {
        text: '이 맛있는 레시피를 확인해보세요!',
        title: 'Recipot - 맛있는 레시피 공유',
        url: typeof window !== 'undefined' ? window.location.href : '',
      };

      await share(shareData);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('공유 취소됨');
      } else {
        console.error('공유 실패:', error);
        alert('공유에 실패했습니다.');
      }
    }
  };

  // 서버 사이드에서는 로딩 표시
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 p-6">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">공유 테스트</h1>
        <p className="mb-8 text-gray-600">
          공유 아이콘을 클릭하여 iOS/Android Share Sheet를 테스트해보세요
        </p>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Web Share API 지원: {isSupported ? '✅ 지원됨' : '❌ 지원되지 않음'}
          </p>
        </div>
      </div>

      <ShareIcon
        size={24}
        onClick={handleShare}
        className="flex cursor-pointer items-center justify-center"
        aria-label="공유하기"
      />

      {isSharing && <p className="text-blue-600">공유 중...</p>}

      {!isSupported && (
        <div className="text-center">
          <p className="mb-2 text-red-500">
            이 브라우저는 Web Share API를 지원하지 않습니다.
          </p>
          <p className="text-sm text-gray-500">
            iOS Safari 또는 Android Chrome에서 테스트해주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleShareTest;
