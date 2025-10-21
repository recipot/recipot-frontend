'use client';

import { useEffect, useState } from 'react';

import { ReviewRemindBottomSheet } from '@/components/review/ReviewRemindBottomSheet';
import { SPLASH_TOTAL_DURATION } from '@/constants/splash';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 스플래시가 완전히 사라진 후 컨텐츠 표시
    const timer = setTimeout(() => {
      setShowContent(true);
    }, SPLASH_TOTAL_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return <div>{showContent && <ReviewRemindBottomSheet />}</div>;
}
