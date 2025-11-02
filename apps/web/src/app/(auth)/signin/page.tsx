'use client';

import { useEffect, useState } from 'react';

import SignInMobileView from './_components/SignInMobileView';

function DesktopSigninLanding() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-50 py-16">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-16 px-12">
        <section className="flex-1 space-y-6">{/* TODO 화면 추가 */}</section>

        <aside className="flex flex-1 justify-center">
          <div className="relative rounded-[40px] border border-white/60 bg-neutral-900/5 p-4 shadow-[0_40px_80px_rgba(15,23,42,0.18)]">
            <iframe
              title="한끼부터"
              src="/signin/mobile"
              className="h-[812px] w-[375px] rounded-[32px] border-0 bg-white"
              loading="lazy"
              scrolling="no"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-black/5" />
          </div>
        </aside>
      </div>
    </div>
  );
}

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

  return <DesktopSigninLanding />;
}
