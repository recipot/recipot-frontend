export const getBackgroundColor = (index: number) => ({
  backgroundColor: `rgba(79, 112, 181, ${index % 2 === 0 ? 0.15 : 0.3})`,
});
