'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // dataLayer가 없으면 초기화
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    // 현재 URL 구성
    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // GTM에 페이지뷰 이벤트 푸시
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_title: document.title,
      page_url: url,
    });
  }, [pathname, searchParams]);

  return null;
}
