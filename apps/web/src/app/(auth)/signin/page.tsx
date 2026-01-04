'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { DesktopLanding } from '@/app/(auth)/signin/_components/DesktopLanding';
import ABTestVariantB from '@/app/ab-test/_components/ABTestVariantB';

import SignInMobileView from './_components/SignInMobileView';

export default function SignInPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchParams = useSearchParams();
  const variant = searchParams.get('variant');

  useEffect(() => {
    setHasMounted(true);

    if (typeof window === 'undefined') {
      return;
    }

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

  // A/B 테스트 B안: 로그인 없이 바로 컨디션 선택 플로우
  if (variant === 'B') {
    return <ABTestVariantB />;
  }

  if (!isDesktop) {
    return <SignInMobileView />;
  }

  return <DesktopLanding iframeSrc="/signin/mobile" />;
}
