'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

import { useState } from 'react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

const SWIPER_MODULES = [Pagination, Autoplay];
const SWIPER_AUTOPLAY = { delay: 3500, disableOnInteraction: false };
const SWIPER_PAGINATION = {
  clickable: true,
  el: '.intro-pagination',
} as const;

const INTRO = [
  {
    alt: '인트로 이미지 1',
    src: '/auth/intro-img.png',
    text: '건강이 걱정돼 식습관을 바꾸고 싶지만…\n쉽지 않죠? 그래서 오늘도\n끼니를 거르거나 배달로 때우셨나요?',
  },
  {
    alt: '인트로 이미지 2',
    src: '/auth/intro-img2.png',
    text: '오늘의 한끼가 건강을 만드니까\n그날그날의 에너지에 따라\n오늘의 한 끼를 도와드릴게요!',
  },
  {
    alt: '인트로 이미지 3',
    src: '/auth/intro-img3.png',
    text: '한끼부터 쉽게 시작해서,\n어느 새 자라있는\n나의 건강을 경험해 보세요!',
  },
];

export default function SignInPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = INTRO.at(activeIndex) ?? INTRO[0];
  return (
    <div className="mx-auto min-h-screen w-full">
      <div className="pb-[calc(128px+env(safe-area-inset-bottom))]">
        <Swiper
          pagination={SWIPER_PAGINATION}
          modules={SWIPER_MODULES}
          className="intro-swiper"
          autoplay={SWIPER_AUTOPLAY}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
        >
          {INTRO.map((item, index) => (
            <SwiperSlide
              key={index}
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
      <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 bg-white/60 px-6 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur">
        <Button
          size="full"
          shape="round"
          className="bg-[#FEE500] text-gray-900"
        >
          <KakaoIcon size={28} />
          카카오로 시작하기
        </Button>
        <Button
          size="full"
          shape="round"
          variant="outline"
          className="bg-white"
        >
          <GoogleIcon />
          Google로 시작하기
        </Button>
      </div>
    </div>
  );
}
