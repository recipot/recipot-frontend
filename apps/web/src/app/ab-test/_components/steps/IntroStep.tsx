'use client';

import 'swiper/css';
import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '@/components/common/Button';
import mainAnimation from '@/components/motion/1main.json';
import searchAnimation from '@/components/motion/2search.json';
import resultAnimation from '@/components/motion/3result.json';
import { cn } from '@/lib/utils';

import type { LottieRefCurrentProps } from 'lottie-react';
import type { Swiper as SwiperType } from 'swiper';

interface IntroStepProps {
  onNext: () => void;
}

const SLIDES = [
  { animation: mainAnimation, alt: '집밥 해먹으려고 했는데.. 결국 시켜먹었나요?' },
  { animation: searchAnimation, alt: '나의 요리할 여유에 따라 지금 있는 재료로 딱 한끼!' },
  { animation: resultAnimation, alt: '한끼의 시작이 이렇게 건강하게 만든다고...?!' },
];

/**
 * A/B 테스트 B안 인트로 스텝
 * 3장의 Lottie 애니메이션 슬라이드를 보여주고, 마지막 슬라이드에서 "레시피 추천받을래요" 버튼 클릭 시 다음 스텝으로 이동
 * 각 슬라이드의 애니메이션은 해당 슬라이드에 도착했을 때만 재생됩니다.
 */
export default function IntroStep({ onNext }: IntroStepProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const lottieRef0 = useRef<LottieRefCurrentProps | null>(null);
  const lottieRef1 = useRef<LottieRefCurrentProps | null>(null);
  const lottieRef2 = useRef<LottieRefCurrentProps | null>(null);
  const lottieRefs = [lottieRef0, lottieRef1, lottieRef2];
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSlideChange = (swiper: SwiperType) => {
    const prevIndex = currentIndex;
    const newIndex = swiper.realIndex;
    setCurrentIndex(newIndex);

    // 이전 슬라이드 정지
    lottieRefs[prevIndex]?.current?.stop();

    // 현재 슬라이드 처음부터 재생
    const currentLottie = lottieRefs[newIndex]?.current;
    if (currentLottie) {
      currentLottie.goToAndPlay(0);
    }
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
            className="ab-intro-swiper h-full"
            onSlideChange={handleSlideChange}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
          >
            {SLIDES.map((slide, index) => (
              <SwiperSlide key={index} className="h-full">
                <div className="flex h-full w-full items-center justify-center">
                  <Lottie
                    lottieRef={lottieRefs[index]}
                    animationData={slide.animation}
                    loop={index !== SLIDES.length - 1}
                    autoplay={index === 0}
                    aria-label={slide.alt}
                    className="h-full w-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Lottie
              animationData={mainAnimation}
              loop
              autoplay
              aria-label={SLIDES[0].alt}
              className="h-full w-full"
            />
          </div>
        )}
      </div>

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
