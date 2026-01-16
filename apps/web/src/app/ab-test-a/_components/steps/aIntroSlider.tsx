'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Swiper as SwiperType } from 'swiper';

const SWIPER_MODULES = [Pagination, Autoplay];
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
  onSwiper?: (swiper: SwiperType) => void;
}

export default function IntroSlider({
  intro,
  onSlideChange,
  onSwiper,
}: Omit<IntroSliderProps, 'current'>) {
  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // 현재 활성화된 슬라이드 인덱스를 관리하는 상태
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderSlideContent = (
    item: IntroSliderProps['intro'][number],
    isPriority: boolean
  ) => (
    <div className="h-full w-full">
      {/* 배경 이미지 */}
      {item.backSrc ? (
        <div className="absolute inset-0">
          <Image
            src={item.backSrc}
            alt={`${item.alt} 배경`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={isPriority}
          />
        </div>
      ) : null}

      {/* 콘텐츠 이미지 - 중앙에 배치 */}
      {item.contentSrc ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4 pb-32">
          <div
            className="relative w-full max-w-[min(390px,80vw)]"
            style={{ aspectRatio: '390/460' }}
          >
            <Image
              src={item.contentSrc}
              alt={item.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 390px"
              priority={isPriority}
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  const paginationStyle = useMemo(
    () => ({
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      left: '0',
      position: 'absolute' as const,
      right: '0',
      top: '10%',
      transform: 'none',
      width: '100%',
      zIndex: 40,
    }),
    []
  );

  const paginationThemeClass = activeIndex === 0 
    ? 'ab-intro-pagination-dark' 
    : 'ab-intro-pagination';

  return (
    <div className="relative h-full w-full">
      <div
        ref={paginationRef}
        className={`intro-pagination h-3 ${paginationThemeClass}`}
        style={paginationStyle}
      />

      {isMounted ? (
        <Swiper
          pagination={SWIPER_PAGINATION}
          modules={SWIPER_MODULES}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
            onSlideChange(swiper); 
          }}
          onSwiper={swiper => {
            swiperRef.current = swiper;
            onSwiper?.(swiper);
          }}
          spaceBetween={0}
          slidesPerView={1}
          watchSlidesProgress
        >
          {intro.map(item => (
            <SwiperSlide
              key={item.id}
              style={{ height: '100%', width: '100%' }}
            >
              {renderSlideContent(item, item.id === 1)}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : intro[0] ? (
        <div>{renderSlideContent(intro[0], true)}</div>
      ) : null}
    </div>
  );
}