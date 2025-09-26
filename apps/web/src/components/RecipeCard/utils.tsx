// RecipeCard 관련 유틸리티 함수들

// 함수들을 컴포넌트 외부로 이동하여 불필요한 재생성 방지
export const getBackgroundColor = (index: number): string => {
  const opacity = index % 2 === 0 ? 0.15 : 0.3;
  return `rgba(79, 112, 181, ${opacity})`;
};

export const getBackgroundStyle = (index: number) => ({
  backgroundColor: getBackgroundColor(index),
});

// 헬퍼 함수들
export const formatRecipeTitle = (title: string) => {
  return title.split('\n');
};
