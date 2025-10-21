'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // 2.5초 후 페이드아웃 시작
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // 3초 후 DOM에서 완전히 제거
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) {
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
