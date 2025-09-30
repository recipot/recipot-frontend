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
