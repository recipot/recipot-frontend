import { EffectCards, Pagination } from 'swiper/modules';

export const SWIPER_MODULES = [EffectCards, Pagination];

export const SWIPER_CONFIG = {
  allowTouchMove: true,
  cardsEffect: {
    perSlideOffset: 12,
    perSlideRotate: 3,
    rotate: true,
    slideShadows: false,
  },
  effect: 'cards' as const,
  grabCursor: true,
  pagination: {
    clickable: true,
    el: '.recipe-pagination',
  },
  resistanceRatio: 0.85,
  slidesPerView: 1,
  spaceBetween: 0,
  threshold: 5,
  touchRatio: 1,
};

// Swiper 스타일 상수
export const swiperStyles = {
  '--swiper-navigation-color': '#212529',
  '--swiper-pagination-color': '#212529',
} as React.CSSProperties;
