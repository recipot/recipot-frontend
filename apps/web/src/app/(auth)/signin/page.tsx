'use client';

import { useEffect, useState } from 'react';

import { DesktopLanding } from '@/app/(auth)/signin/_components/DesktopLanding';

import SignInMobileView from './_components/SignInMobileView';

export default function SignInPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (!isDesktop) {
    return <SignInMobileView />;
  }

  return <DesktopLanding iframeSrc="/signin/mobile" />;
}
