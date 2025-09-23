'use client';

import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <header className="flex h-14 items-center justify-between px-3 py-2">
        <button
          className="flex size-10 items-center justify-center"
          onClick={() => router.back()}
        >
          <BackIcon size={24} />
        </button>
        <button className="flex size-10 items-center justify-center">
          <RefreshIcon size={24} />
        </button>
      </header>
      <div>{children}</div>
    </>
  );
}
