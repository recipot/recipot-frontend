'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { InstagramIcon, YouTubeIcon } from '@/components/Icons';
import { cn } from '@/lib/utils';

import { TermsOfServiceBottomSheet } from './TermsOfServiceBottomSheet';

interface DesktopLandingProps {
  iframeSrc: string;
  wrapperClassName?: string;
}

export function DesktopLanding({
  iframeSrc,
  wrapperClassName,
}: DesktopLandingProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <div
      className={cn(
        'flex min-h-screen w-full items-center justify-center bg-neutral-50 py-16',
        wrapperClassName
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-16 px-12">
        <section className="flex-1 space-y-6">
          <aside className="hidden lg:flex lg:w-[460px] lg:flex-col lg:justify-center lg:gap-10 lg:px-16 lg:py-14">
            <div className="space-y-6 text-center">
              <span className="text-24 font-semibold text-[#68982D]">
                귀찮은 나를 위한 집밥 루틴 서비스
              </span>
              <h1 className="">
                <Image
                  src="/logo.png"
                  alt="한끼부터"
                  width={352}
                  height={94}
                  className="h-auto w-full max-w-[352px] object-contain"
                  priority
                  quality={100}
                  unoptimized={false}
                />
              </h1>
              <div className="mt-6 h-0 w-full border-t border-dashed border-gray-300" />
              <p className="text-base leading-relaxed text-gray-600">
                이제 집밥 루틴 서비스 <br />
                한끼부터로 집밥 결심 작심삼일은 안녕! <br />
                장 볼 필요, 메뉴 걱정, 요리 부담 모두 없앴어요. <br />
                한끼부터와 한끼 한끼 해먹으면서 <br />
                성취감과 가뿐해지는 몸을 경험해보세요!
              </p>
            </div>

            <div className="text-14 space-y-5 text-center text-gray-500">
              <div className="flex items-center justify-center gap-4 text-gray-400">
                <Link
                  href="https://www.instagram.com/start.by.one.meal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-70"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} color="#111827" />
                </Link>
                <Link
                  href="https://www.youtube.com/@%ED%95%9C%EB%81%BC%EB%B6%80%ED%84%B0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity hover:opacity-70"
                  aria-label="YouTube"
                >
                  <YouTubeIcon size={20} color="#111827" />
                </Link>
              </div>
              <p className="text-xs text-gray-400">
                © hankkibuteo. All rights reserved.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsTermsOpen(true)}
                className="text-gray-500"
              >
                이용약관
              </Button>
              <Link
                href="https://slashpage.com/hankki/qpv5x427xr9e1mkyn3dw"
                className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-[#68982D] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#547727]"
              >
                문의하러 가기
              </Link>
            </div>
          </aside>

          <TermsOfServiceBottomSheet
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
          />
        </section>

        <aside className="flex flex-1 justify-center">
          <div className="relative rounded-[40px] border border-white/60 bg-neutral-900/5 p-4 shadow-[0_40px_80px_rgba(15,23,42,0.18)]">
            <iframe
              title="한끼부터"
              src={iframeSrc}
              className="h-[812px] w-[375px] rounded-[32px] border-0 bg-white"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-black/5" />
          </div>
        </aside>
      </div>
    </div>
  );
}
