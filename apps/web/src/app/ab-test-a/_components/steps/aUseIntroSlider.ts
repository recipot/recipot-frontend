import { useState } from 'react';

const INTRO = [
  {
    alt: '야악!',
    backSrc: '/auth/intro-img1-back.png',
    contentSrc: '/auth/intro-img1a-content.png',
    id: 1,
  },
  {
    alt: '오늘의 요리 여유에 따라 냉장고에 있는 재료로 한끼!',
    backSrc: '/auth/intro-img2-back.png',
    contentSrc: '/auth/intro-img2a-content.png',
    id: 2,
  },
  {
    alt: '내가.. 한끼 잘먹고 이렇게까나 클 수 있다니...?! 상상하니 기분좋다',
    backSrc: '/auth/intro-img3-back.png',
    contentSrc: '/auth/intro-img3a-content.png',
    id: 3,
  },
];

export default function useIntroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: { realIndex: number }) => {
    setActiveIndex(swiper.realIndex);
  };

  return {
    activeIndex,
    handleSlideChange,
    intro: INTRO,
  };
}
