'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  SPLASH_DISPLAY_DURATION,
  SPLASH_TOTAL_DURATION,
} from '@/constants/splash';
import { useSplash } from '@/contexts/SplashContext';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const { isCompleted, markAsCompleted } = useSplash();

  // 이미 완료된 경우 렌더링하지 않음
  useEffect(() => {
    if (isCompleted) {
      setShouldRender(false);
    }
  }, [isCompleted]);

  useEffect(() => {
    // 이미 완료된 경우 타이머 설정하지 않음
    if (isCompleted || !shouldRender) {
      return;
    }

    // 페이드아웃 시작
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, SPLASH_DISPLAY_DURATION);

    // DOM에서 완전히 제거 및 완료 상태 업데이트
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      markAsCompleted();
    }, SPLASH_TOTAL_DURATION);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [isCompleted, shouldRender, markAsCompleted]);

  if (!shouldRender || isCompleted) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 하단 그라데이션 */}
      <div className="from-primary/10 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />

      {/* 스플래시 이미지 */}
      <div className="relative z-10 flex items-center justify-center">
        <Image
          src="/img-splash.png"
          alt="한끼부터"
          width={194}
          height={132}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
