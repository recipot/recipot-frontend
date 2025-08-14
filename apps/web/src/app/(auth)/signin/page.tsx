'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

import { useState } from 'react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

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

const icon = {
  google: {
    alt: 'Google Icon',
    src: '/auth/icon-google.svg',
  },
  kakao: {
    alt: 'Kakao Icon',
    src: '/auth/icon-kakao.svg',
  },
};
export default function SignInPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = INTRO.at(activeIndex) ?? INTRO[0];
  return (
    <div className="mx-auto w-full min-h-screen">
      <div className="pb-[calc(128px+env(safe-area-inset-bottom))]">
        <Swiper
          pagination={SWIPER_PAGINATION}
          modules={SWIPER_MODULES}
          className="intro-swiper"
          autoplay={SWIPER_AUTOPLAY}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}>
          {INTRO.map((item, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
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
        <p className="mt-6 whitespace-pre-line text-center text-lg text-neutral-950 font-semibold">{current.text}</p>
      </div>
      <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white/60 backdrop-blur flex flex-col items-center gap-3 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] px-6">
        {/* TODO 추후 컴포넌트 교체 */}
        <button
          type="button"
          className="py-3 bg-[#FCE40B] rounded-full w-full text-[17px] font-semibold text-neutral-900 flex justify-center items-center gap-2">
          <Image src={icon.kakao.src} alt={icon.kakao.alt} width={20} height={20} />
          <span>카카오로 시작하기</span>
        </button>
        <button
          type="button"
          className="py-3 bg-white rounded-full w-full text-[17px] font-semibold border border-neutral-400 text-neutral-900 flex justify-center items-center gap-2">
          <Image src={icon.google.src} alt={icon.google.alt} width={20} height={20} />
          <span>Google로 시작하기</span>
        </button>
      </div>
    </div>
  );
}
