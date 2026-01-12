'use client';

import { useCallback, useMemo, useRef } from 'react';

import IntroSlider from './ABIntroSlider';
import useIntroSlider from './ABuseIntroSlider';

import type { Swiper as SwiperType } from 'swiper';

interface ABIntroStepProps {
  onNext: () => void;
}

export default function ABIntroStep({ onNext }: ABIntroStepProps) {
  const { activeIndex, handleSlideChange, intro } = useIntroSlider();
  const swiperRef = useRef<SwiperType | null>(null);

  // 슬라이드별 페이지 배경색 설정
  const pageStyle = useMemo(() => {
    const isFirstSlide = activeIndex === 0;
    return {
      backgroundColor: isFirstSlide ? '#3D2A58' : '#FFEFC7',
    };
  }, [activeIndex]);

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
    <div className="mx-auto min-h-screen w-full" style={pageStyle}>
      <IntroSlider
        intro={intro}
        onSlideChange={handleSlideChange}
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
      />

      {/* 하단 버튼 영역 - 이미지 위에 오버레이 */}
      <div>
        <button
          onClick={handleNext}
          className="w-full rounded-lg bg-[#6B9E3E] py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#5a8533] active:bg-[#4d7229]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
