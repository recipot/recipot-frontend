export const getBackgroundColor = (index: number) => ({
  backgroundColor: `rgba(79, 112, 181, ${index % 2 === 0 ? 0.15 : 0.3})`,
});

// 헬퍼 함수들
export const formatRecipeTitle = (title: string) => {
  return title.split('\n');
};
