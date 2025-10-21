'use client';

import { useEffect, useState } from 'react';

import { ReviewRemindBottomSheet } from '@/components/review/ReviewRemindBottomSheet';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // 스플래시가 완전히 사라진 후 (3초) 컨텐츠 표시
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <div>{showContent && <ReviewRemindBottomSheet />}</div>;
}
