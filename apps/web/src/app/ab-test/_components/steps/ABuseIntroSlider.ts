import { useState } from 'react';

const INTRO = [
  {
    alt: '집밥 해먹으려고 했는데.. 결국 시켜먹었나요?',
    backSrc: '/auth/intro-img1-back.png',
    contentSrc: '/auth/intro-img1-content.png',
    id: 1,
  },
  {
    alt: '나의 요리할 여유에 따라 지금 있는 재료로 딱 한끼!',
    backSrc: '/auth/intro-img2-back.png',
    contentSrc: '/auth/intro-img2-content.png',
    id: 2,
  },
  {
    alt: '한끼의 시작이 이렇게 건강하게 만든다고...?!',
    backSrc: '/auth/intro-img3-back.png',
    contentSrc: '/auth/intro-img3-content.png',
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
