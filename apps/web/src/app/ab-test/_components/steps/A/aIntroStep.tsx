'use client';

import { useCallback, useMemo, useRef } from 'react';

import IntroSlider from './aIntroSlider';
import useIntroSlider from './aUseIntroSlider';

import type { Swiper as SwiperType } from 'swiper';

interface ABIntroStepProps {
  onNext: () => void;
}

export default function ABIntroStep({ onNext }: ABIntroStepProps) {
  const { activeIndex, handleSlideChange, intro } = useIntroSlider();
  const swiperRef = useRef<SwiperType | null>(null);

  // 버튼 클릭 핸들러
  const handleNext = useCallback(() => {
    const isLastSlide = activeIndex === intro.length - 1;

    if (isLastSlide) {
      // 마지막 슬라이드에서는 다음 step으로 이동
      onNext();
    } else {
      // 다음 슬라이드로 이동
      swiperRef.current?.slideNext();
    }
  }, [activeIndex, intro.length, onNext]);

  // 버튼 텍스트
  const buttonText = useMemo(() => {
    const isLastSlide = activeIndex === intro.length - 1;
    return isLastSlide ? '레시피 추천받기' : '다음으로';
  }, [activeIndex, intro.length]);

  return (
    <div className="relative mx-auto min-h-screen w-full">
      {/* 슬라이더 영역 */}
      <div className="relative h-screen">
        <IntroSlider
          intro={intro}
          onSlideChange={handleSlideChange}
          onSwiper={swiper => {
            swiperRef.current = swiper;
          }}
        />

        {/* 하단 버튼 영역 - 슬라이더 위에 absolute로 오버레이 */}
        <div className="fixed right-0 bottom-0 left-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={handleNext}
            className="w-full rounded-lg bg-[#6B9E3E] py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#5a8533] active:bg-[#4d7229]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
