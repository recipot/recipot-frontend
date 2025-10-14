import { EffectCards, Pagination } from 'swiper/modules';

export const SWIPER_MODULES = [EffectCards, Pagination];

export const SWIPER_CONFIG = {
  cardsEffect: {
    perSlideOffset: 12,
    perSlideRotate: 3,
    rotate: true,
    slideShadows: false,
  },
  effect: 'cards' as const,
  slidesPerView: 1,
  spaceBetween: 0,

  // 터치/스와이프 설정
  allowTouchMove: true,
  grabCursor: true,
};

// Swiper 스타일 상수
export const swiperStyles = {
  '--swiper-navigation-color': '#212529',
  '--swiper-pagination-color': '#212529',
} as React.CSSProperties;
