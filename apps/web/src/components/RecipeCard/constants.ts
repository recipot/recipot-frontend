// RecipeCard 관련 상수들
export const GRADIENT_OVERLAY_STYLE = {
  background:
    'linear-gradient(180deg, rgba(79, 112, 181, 0) 0%, rgba(79, 112, 181, 0.8) 50%, rgba(79, 112, 181, 0.95) 100%)',
} as const;

export const TOP_GRADIENT_OVERLAY_STYLE = {
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)',
} as const;

export const CARD_DIMENSIONS = {
  height: 460,
  width: 310,
};

// 반응형 카드 스타일 - 부모 컨테이너 크기에 맞춤
export const CARD_STYLES = {
  card: {
    aspectRatio: '310 / 460',
    height: 'auto',
    maxHeight: '100%',
    width: '100%',
  },
  container: {
    aspectRatio: '310 / 460',
    height: 'auto',
    maxHeight: '100%',
    width: '100%',
  },
};
