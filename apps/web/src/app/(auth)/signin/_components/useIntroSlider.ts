import { useState } from 'react';

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

export function useIntroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const current = INTRO.at(activeIndex) ?? INTRO[0];

  const handleSlideChange = (swiper: { realIndex: number }) => {
    setActiveIndex(swiper.realIndex);
  };

  return {
    activeIndex,
    current,
    handleSlideChange,
    intro: INTRO,
  };
}
