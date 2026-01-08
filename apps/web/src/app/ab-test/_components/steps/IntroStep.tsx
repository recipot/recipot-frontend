'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

import type { Swiper as SwiperType } from 'swiper';

const SWIPER_MODULES = [Pagination];

interface IntroStepProps {
  onNext: () => void;
}

/** 슬라이드 1: 고민하는 병아리 - 보라색 소용돌이 배경 */
function IntroSlide1() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/auth/intro-img1-back.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* 콘텐츠 이미지 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <Image
          src="/auth/intro-img1-content.png"
          alt="집밥 해먹으려고 했는데.. 결국 시켜먹었나요?"
          width={280}
          height={320}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

/** 슬라이드 2: 냉장고 재료 - 베이지색 부엌 배경 */
function IntroSlide2() {
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/auth/intro-img2-back.png"
        alt=""
        fill
        className="object-cover"
      />
      {/* 콘텐츠 이미지 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <Image
          src="/auth/intro-img2-content.png"
          alt="나의 요리할 여유에 따라 지금 있는 재료로 딱 한끼!"
          width={280}
          height={320}
          className="object-contain"
        />
      </div>
    </div>
  );
}

/** 슬라이드 3: 성장한 병아리 - 베이지색 방 배경 */
function IntroSlide3() {
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/auth/intro-img3-back.png"
        alt=""
        fill
        className="object-cover"
      />
      {/* 콘텐츠 이미지 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <Image
          src="/auth/intro-img3-content.png"
          alt="한끼의 시작이 이렇게 건강하게 만든다고...?!"
          width={280}
          height={320}
          className="object-contain"
        />
      </div>
    </div>
  );
}

const SLIDES = [IntroSlide1, IntroSlide2, IntroSlide3];

/**
 * A/B 테스트 B안 인트로 스텝
 * 3장의 소개 슬라이드를 보여주고, 마지막 슬라이드에서 "레시피 추천받을래요" 버튼 클릭 시 다음 스텝으로 이동
 */
export default function IntroStep({ onNext }: IntroStepProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const isDarkPagination = currentIndex === 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.realIndex);
  };

  const handleButtonClick = () => {
    if (isLastSlide) {
      onNext();
    } else {
      swiperRef.current?.slideNext();
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col">
      <div className="flex-1">
        {isMounted ? (
          <Swiper
            pagination={{
              clickable: true,
              el: '.ab-intro-pagination',
            }}
            modules={SWIPER_MODULES}
            className="ab-intro-swiper h-full"
            onSlideChange={handleSlideChange}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
          >
            {SLIDES.map((SlideComponent, index) => (
              <SwiperSlide key={index} className="h-full">
                <SlideComponent />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <IntroSlide1 />
        )}
      </div>

      {/* 페이지네이션 */}
      <div
        className={cn(
          'ab-intro-pagination absolute right-0 bottom-[120px] left-0 z-50 flex items-center justify-center',
          isDarkPagination && 'ab-intro-pagination-dark'
        )}
      />

      {/* 하단 버튼 영역 */}
      <div className="absolute right-0 bottom-0 left-0 z-50 bg-gradient-to-t from-black/20 to-transparent px-6 pt-8 pb-10">
        <Button
          size="full"
          onClick={handleButtonClick}
          className={cn(!isLastSlide && currentIndex === 0 && 'bg-primary')}
        >
          {isLastSlide ? '레시피 추천받을래요' : '다음으로'}
        </Button>
      </div>
    </div>
  );
}
