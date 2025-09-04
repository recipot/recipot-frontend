'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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
    src: string;
    text: string;
  }>;
  current: {
    alt: string;
    id: number;
    src: string;
    text: string;
  };
  onSlideChange: (swiper: { realIndex: number }) => void;
}

export function IntroSlider({
  current,
  intro,
  onSlideChange,
}: IntroSliderProps) {
  return (
    <div className="pb-[calc(128px+env(safe-area-inset-bottom))]">
      <Swiper
        pagination={SWIPER_PAGINATION}
        modules={SWIPER_MODULES}
        className="intro-swiper"
        autoplay={SWIPER_AUTOPLAY}
        onSlideChange={onSlideChange}
      >
        {intro.map(item => (
          <SwiperSlide
            key={item.id}
            className="flex items-center justify-center"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={390}
              height={460}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="intro-pagination mt-5 flex justify-center" />
      <p className="mt-6 text-center text-lg font-semibold whitespace-pre-line text-neutral-950">
        {current.text}
      </p>
    </div>
  );
}
