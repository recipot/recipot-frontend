import type {
  Recipe,
  RecommendationItem,
} from '@/app/recipe/[id]/types/recipe.types';

/**
 * API 응답의 RecommendationItem을 Recipe 타입으로 변환
 */
export const mapRecommendationToRecipe = (item: RecommendationItem): Recipe => {
  const images = (item.imageUrls ?? []).map((url, index) => ({
    id: index + 1,
    imageUrl: url,
  }));

  const tools = (item.tools ?? []).map((tool, index) => {
    if (typeof tool === 'string') {
      return {
        id: index + 1,
        name: tool,
      };
    }
    return {
      id: tool.id ?? index + 1,
      name: tool.name ?? '',
      ...(tool.imageUrl && { imageUrl: tool.imageUrl }),
    };
  });

  const isBookmarked = item.isBookmarked ?? false;

  // API 응답의 isBookmarked 값 로깅 (디버깅용)
  if (item.recipeId) {
    console.info('[recipeMapper] 레시피 북마크 상태 매핑', {
      apiIsBookmarked: item.isBookmarked,
      mappedIsBookmarked: isBookmarked,
      recipeId: item.recipeId,
      recipeTitle: item.title,
    });
  }

  return {
    description: item.description ?? '',
    duration: item.duration ?? '',
    id: item.recipeId,
    images,
    ingredients: {
      alternativeUnavailable: [],
      notOwned: [],
      owned: [],
    },
    isBookmarked,
    seasonings: [],
    steps: [],
    title: item.title ?? '',
    tools,
  };
};
