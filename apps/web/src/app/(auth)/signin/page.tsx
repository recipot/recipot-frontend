'use client';

import { Suspense, useEffect, useState } from 'react';

import { DesktopLanding } from '@/app/(auth)/signin/_components/DesktopLanding';
import ABTestVariantA from '@/app/ab-test/_components/ABTestVariantA';
import ABTestVariantB from '@/app/ab-test/_components/ABTestVariantB';

import SignInMobileView from './_components/SignInMobileView';

function SignInContent() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [variant, setVariant] = useState<string | undefined>(undefined);

  useEffect(() => {
    setHasMounted(true);

    if (typeof window === 'undefined') {
      return;
    }

    // 쿠키에서 A/B 테스트 변형 읽기
    const cookieVariant = document.cookie
      .split('; ')
      .find(row => row.startsWith('ab-onboarding-variant='))
      ?.split('=')[1];
    setVariant(cookieVariant);

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (!hasMounted) {
    return null;
  }

  // A/B 테스트: 쿠키에 변형이 있으면 해당 변형 렌더링
  if (variant === 'A') {
    return <ABTestVariantA />;
  }

  if (variant === 'B') {
    return <ABTestVariantB />;
  }

  // 쿠키 없으면 일반 로그인 페이지
  if (!isDesktop) {
    return <SignInMobileView />;
  }

  return <DesktopLanding iframeSrc="/signin/mobile" />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
