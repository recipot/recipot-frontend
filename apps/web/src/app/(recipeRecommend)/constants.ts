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

  // 성능 최적화 설정
  lazy: true,
  preloadImages: false,
  watchSlidesProgress: true,
  watchSlidesVisibility: true,

  // 애니메이션 최적화
  allowSlideNext: true,
  allowSlidePrev: true,
  resistanceRatio: 0.85,
  simulateTouch: true,
  speed: 300,
  touchAngle: 45,
  touchRatio: 1,
};

// Swiper 스타일 상수
export const swiperStyles = {
  '--swiper-navigation-color': '#212529',
  '--swiper-pagination-color': '#212529',
} as React.CSSProperties;
