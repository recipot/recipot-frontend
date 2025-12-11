import type {
  AdminRecipe,
  RecipePutRequest,
  RecipeUpdateRequest,
} from '@recipot/api';

/**
 * AdminRecipe를 RecipeUpdateRequest로 변환
 */
function convertAdminRecipeToUpdateRequest(
  adminRecipe: AdminRecipe,
  getConditionId: (conditionName?: string) => number
): RecipeUpdateRequest {
  return {
    conditionId: getConditionId(adminRecipe.condition),
    description: adminRecipe.description ?? '',
    duration:
      typeof adminRecipe.duration === 'number'
        ? adminRecipe.duration
        : Number(adminRecipe.duration) || 0,
    id: adminRecipe.id,
    imageUrl: adminRecipe.imageUrl,
    ingredients:
      adminRecipe.ingredients?.map(({ amount, id, isAlternative }) => ({
        amount,
        id,
        isAlternative,
      })) ?? [],
    seasonings:
      adminRecipe.seasonings?.map(({ amount, id }) => ({ amount, id })) ?? [],
    steps: adminRecipe.steps ?? [],
    title: adminRecipe.title,
    tools: adminRecipe.tools?.map(({ id }) => ({ id })) ?? [],
  };
}

/**
 * 수정된 레시피 맵을 API 요청 형식으로 변환
 *
 * 편집 추적 방식: 사용자가 수정한 필드만 Map에 저장되므로,
 * 원본 레시피 데이터와 병합하여 완전한 API 요청 데이터를 생성합니다.
 */
export function convertToUpdateRequests(
  editedRecipes: Map<number, Partial<RecipeUpdateRequest>>,
  recipes: AdminRecipe[],
  getConditionId: (conditionName?: string) => number
): RecipeUpdateRequest[] {
  return Array.from(editedRecipes.entries()).map(([recipeId, edits]) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      throw new Error(`레시피 ID ${recipeId}를 찾을 수 없습니다.`);
    }

    return {
      ...convertAdminRecipeToUpdateRequest(recipe, getConditionId),
      ...edits,
    };
  });
}

/**
 * RecipeUpdateRequest를 RecipePutRequest로 변환
 *
 * API 설계 불일치로 인한 변환:
 * - PUT /v1/recipes/:id: ingredientId, seasoningId, toolId 사용
 * - POST /v1/recipes: id 사용
 *
 * 단일 레시피 수정 시 PUT API를 사용하므로 필드명 변환이 필요합니다.
 */
export function convertUpdateRequestToPutRequest(
  updateRequest: RecipeUpdateRequest
): RecipePutRequest {
  return {
    conditionId: updateRequest.conditionId,
    description: updateRequest.description,
    duration: updateRequest.duration,
    healthPoints: [], // TODO: healthPoints 데이터 추가 필요 시 구현
    images: updateRequest.imageUrl
      ? [{ imageUrl: updateRequest.imageUrl }]
      : [],
    ingredients: updateRequest.ingredients.map(ingredient => ({
      amount: ingredient.amount,
      ingredientId: ingredient.id,
      isAlternative: ingredient.isAlternative,
    })),
    seasonings: updateRequest.seasonings.map(seasoning => ({
      amount: seasoning.amount,
      seasoningId: seasoning.id,
    })),
    steps: updateRequest.steps.map(step => ({
      content: step.content,
      imageUrl: step.imageUrl,
      orderNum: step.orderNum,
      summary: step.summary,
    })),
    title: updateRequest.title,
    tools: updateRequest.tools.map(tool => ({
      toolId: tool.id,
    })),
  };
}
