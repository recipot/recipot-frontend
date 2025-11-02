'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Swiper as SwiperType } from 'swiper';

const SWIPER_MODULES = [Pagination, Autoplay];
const SWIPER_AUTOPLAY = { delay: 3500, disableOnInteraction: false };
const SWIPER_PAGINATION = {
  clickable: true,
  el: '.intro-pagination',
} as const;

interface IntroSliderProps {
  intro: Array<{
    alt: string;
    id: number;
    backSrc?: string;
    contentSrc?: string;
  }>;
  onSlideChange: (swiper: { realIndex: number }) => void;
}

export function IntroSlider({
  intro,
  onSlideChange,
}: Omit<IntroSliderProps, 'current'>) {
  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderSlideContent = (
    item: IntroSliderProps['intro'][number],
    isPriority: boolean
  ) => (
    <>
      {item.backSrc ? (
        <Image
          src={item.backSrc}
          alt={`${item.alt} 배경`}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={isPriority}
        />
      ) : null}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {item.contentSrc ? (
          <Image
            src={item.contentSrc}
            alt={item.alt}
            width={390}
            height={460}
            className="h-auto w-full max-w-[390px]"
            sizes="(max-width: 768px) 100vw, 390px"
            priority={isPriority}
          />
        ) : null}
      </div>
    </>
  );

  // 페이지네이션 인라인 스타일
  const paginationStyle = useMemo(
    () => ({
      alignItems: 'center',
      bottom: '36px',
      display: 'flex',
      justifyContent: 'center',
      left: '0',
      position: 'absolute' as const,
      right: '0',
      top: 'auto',
      transform: 'none',
      width: '100%',
      zIndex: 50,
    }),
    []
  );

  return (
    <div className="relative h-screen pb-[calc(128px+env(safe-area-inset-bottom))]">
      <div className="relative h-full">
        {isMounted ? (
          <Swiper
            pagination={SWIPER_PAGINATION}
            modules={SWIPER_MODULES}
            className="intro-swiper h-full"
            autoplay={SWIPER_AUTOPLAY}
            onSlideChange={onSlideChange}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
          >
            {intro.map(item => (
              <SwiperSlide
                key={item.id}
                className="relative flex h-full items-center justify-center"
              >
                {renderSlideContent(item, item.id === 1)}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : intro[0] ? (
          <div className="relative flex h-full items-center justify-center">
            {renderSlideContent(intro[0], true)}
          </div>
        ) : null}
        <div
          ref={paginationRef}
          className="intro-pagination"
          style={paginationStyle}
        />
      </div>
    </div>
  );
}
