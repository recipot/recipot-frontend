import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

export interface RecipeValidationError {
  recipeId: number;
  field: string;
  message: string;
  errorType: 'missing' | 'format'; // 'missing': 데이터 미등록, 'format': 입력 형식 오류
}

export interface RecipeValidationResult {
  isValid: boolean;
  errors: RecipeValidationError[];
}

/**
 * 레시피 업데이트 요청 데이터 검증
 * @param recipe - 검증할 레시피 데이터
 * @returns 검증 결과
 */
export function validateRecipeUpdateRequest(
  recipe: RecipeUpdateRequest
): RecipeValidationResult {
  const errors: RecipeValidationError[] = [];

  // 필수 필드 검증
  if (
    recipe.id === undefined ||
    recipe.id === null ||
    recipe.id <= 0 ||
    typeof recipe.id !== 'number'
  ) {
    errors.push({
      errorType: 'format',
      field: 'id',
      message: '레시피 ID가 유효하지 않습니다.',
      recipeId: recipe.id ?? 0,
    });
  }

  if (
    !recipe.title ||
    (typeof recipe.title === 'string' && recipe.title.trim().length === 0)
  ) {
    errors.push({
      errorType: 'missing',
      field: 'title',
      message: '레시피 제목을 입력해주세요.',
      recipeId: recipe.id,
    });
  }

  if (
    recipe.duration === undefined ||
    recipe.duration === null ||
    recipe.duration <= 0 ||
    typeof recipe.duration !== 'number'
  ) {
    errors.push({
      errorType: 'format',
      field: 'duration',
      message: '조리시간은 1분 이상이어야 합니다.',
      recipeId: recipe.id,
    });
  }

  if (
    recipe.conditionId === undefined ||
    recipe.conditionId === null ||
    recipe.conditionId <= 0 ||
    typeof recipe.conditionId !== 'number'
  ) {
    errors.push({
      errorType: 'missing',
      field: 'conditionId',
      message: '유저 컨디션을 선택해주세요.',
      recipeId: recipe.id,
    });
  }

  if (
    !recipe.description ||
    (typeof recipe.description === 'string' &&
      recipe.description.trim().length === 0)
  ) {
    errors.push({
      errorType: 'missing',
      field: 'description',
      message: '후킹 타이틀을 입력해주세요.',
      recipeId: recipe.id,
    });
  }

  // 배열 필드 검증 - tools (최소 1개 이상)
  if (!Array.isArray(recipe.tools) || recipe.tools.length === 0) {
    errors.push({
      errorType: 'missing',
      field: 'tools',
      message: '조리도구를 최소 1개 이상 선택해주세요.',
      recipeId: recipe.id,
    });
  } else {
    // tools 각 항목 검증
    recipe.tools.forEach((tool, index) => {
      if (
        tool?.id === undefined ||
        tool?.id === null ||
        tool?.id <= 0 ||
        typeof tool?.id !== 'number'
      ) {
        errors.push({
          errorType: 'format',
          field: `tools[${index}].id`,
          message: `조리도구 ${index + 1}번의 ID가 유효하지 않습니다.`,
          recipeId: recipe.id,
        });
      }
    });
  }

  // 배열 필드 검증 - ingredients (최소 1개 이상)
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.push({
      errorType: 'missing',
      field: 'ingredients',
      message: '재료를 최소 1개 이상 추가해주세요.',
      recipeId: recipe.id,
    });
  } else {
    // ingredients 각 항목 검증
    recipe.ingredients.forEach((ingredient, index) => {
      if (
        ingredient?.id === undefined ||
        ingredient?.id === null ||
        ingredient?.id <= 0 ||
        typeof ingredient?.id !== 'number'
      ) {
        errors.push({
          errorType: 'format',
          field: `ingredients[${index}].id`,
          message: `재료 ${index + 1}번의 ID가 유효하지 않습니다.`,
          recipeId: recipe.id,
        });
      }
      if (
        !ingredient?.amount ||
        (typeof ingredient.amount === 'string' &&
          ingredient.amount.trim().length === 0)
      ) {
        errors.push({
          errorType: 'missing',
          field: `ingredients[${index}].amount`,
          message: `재료 ${index + 1}번의 양을 입력해주세요.`,
          recipeId: recipe.id,
        });
      }
    });
  }

  // 배열 필드 검증 - seasonings (최소 1개 이상)
  if (!Array.isArray(recipe.seasonings) || recipe.seasonings.length === 0) {
    errors.push({
      errorType: 'missing',
      field: 'seasonings',
      message: '양념을 최소 1개 이상 추가해주세요.',
      recipeId: recipe.id,
    });
  } else {
    // seasonings 각 항목 검증
    recipe.seasonings.forEach((seasoning, index) => {
      if (
        seasoning?.id === undefined ||
        seasoning?.id === null ||
        seasoning?.id <= 0 ||
        typeof seasoning?.id !== 'number'
      ) {
        errors.push({
          errorType: 'format',
          field: `seasonings[${index}].id`,
          message: `양념 ${index + 1}번의 ID가 유효하지 않습니다.`,
          recipeId: recipe.id,
        });
      }
      if (
        !seasoning?.amount ||
        (typeof seasoning.amount === 'string' &&
          seasoning.amount.trim().length === 0)
      ) {
        errors.push({
          errorType: 'missing',
          field: `seasonings[${index}].amount`,
          message: `양념 ${index + 1}번의 양을 입력해주세요.`,
          recipeId: recipe.id,
        });
      }
    });
  }

  // 배열 필드 검증 - steps (최소 1개 이상)
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    errors.push({
      errorType: 'missing',
      field: 'steps',
      message: '요리 단계를 최소 1개 이상 추가해주세요.',
      recipeId: recipe.id,
    });
  } else {
    // steps 각 항목 검증
    recipe.steps.forEach((step, index) => {
      if (
        step?.orderNum === undefined ||
        step?.orderNum === null ||
        step?.orderNum < 0 ||
        typeof step?.orderNum !== 'number'
      ) {
        errors.push({
          errorType: 'format',
          field: `steps[${index}].orderNum`,
          message: `요리 단계 ${index + 1}번의 순서 번호가 유효하지 않습니다.`,
          recipeId: recipe.id,
        });
      }
      if (
        !step?.summary ||
        (typeof step.summary === 'string' && step.summary.trim().length === 0)
      ) {
        errors.push({
          errorType: 'missing',
          field: `steps[${index}].summary`,
          message: `요리 단계 ${index + 1}번의 요약을 입력해주세요.`,
          recipeId: recipe.id,
        });
      }
      if (
        !step?.content ||
        (typeof step.content === 'string' && step.content.trim().length === 0)
      ) {
        errors.push({
          errorType: 'missing',
          field: `steps[${index}].content`,
          message: `요리 단계 ${index + 1}번의 내용을 입력해주세요.`,
          recipeId: recipe.id,
        });
      }
      // imageUrl 검증 추가
      if (
        !step?.imageUrl ||
        (typeof step.imageUrl === 'string' && step.imageUrl.trim().length === 0)
      ) {
        errors.push({
          errorType: 'missing',
          field: `steps[${index}].imageUrl`,
          message: `요리 단계 ${index + 1}번의 이미지를 입력해주세요.`,
          recipeId: recipe.id,
        });
      }
    });
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}

/**
 * 레시피가 전 컬럼 공란인지 확인 (RecipeUpdateRequest용)
 * @param recipe - 확인할 레시피 데이터
 * @returns 전 컬럼 공란 여부
 */
export function isRecipeCompletelyEmpty(recipe: RecipeUpdateRequest): boolean {
  // 모든 필수 필드가 비어있거나 기본값인지 확인
  const hasTitle = recipe.title && recipe.title.trim().length > 0;
  const hasDuration = recipe.duration && recipe.duration > 0;
  const hasConditionId = recipe.conditionId && recipe.conditionId > 0;
  const hasDescription =
    recipe.description && recipe.description.trim().length > 0;
  const hasImageUrl = recipe.imageUrl && recipe.imageUrl.trim().length > 0;
  const hasTools = Array.isArray(recipe.tools) && recipe.tools.length > 0;
  const hasIngredients =
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasSeasonings =
    Array.isArray(recipe.seasonings) && recipe.seasonings.length > 0;
  const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;

  // 모든 필드가 비어있으면 전 컬럼 공란
  return (
    !hasTitle &&
    !hasDuration &&
    !hasConditionId &&
    !hasDescription &&
    !hasImageUrl &&
    !hasTools &&
    !hasIngredients &&
    !hasSeasonings &&
    !hasSteps
  );
}

/**
 * 레시피가 전 컬럼 공란인지 확인 (AdminRecipe용)
 * @param recipe - 확인할 레시피 데이터
 * @returns 전 컬럼 공란 여부
 */
export function isAdminRecipeCompletelyEmpty(recipe: AdminRecipe): boolean {
  // 모든 필수 필드가 비어있거나 기본값인지 확인
  const hasTitle = recipe.title && recipe.title.trim().length > 0;
  const hasDuration = recipe.duration && recipe.duration > 0;
  const hasCondition = recipe.condition && recipe.condition.trim().length > 0;
  const hasDescription =
    recipe.description && recipe.description.trim().length > 0;
  const hasImageUrl = recipe.imageUrl && recipe.imageUrl.trim().length > 0;
  const hasTools = Array.isArray(recipe.tools) && recipe.tools.length > 0;
  const hasIngredients =
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasSeasonings =
    Array.isArray(recipe.seasonings) && recipe.seasonings.length > 0;
  const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
  const hasIrreplaceableIngredients =
    recipe.irreplaceableIngredients &&
    recipe.irreplaceableIngredients.trim().length > 0;

  // 모든 필드가 비어있으면 전 컬럼 공란
  return (
    !hasTitle &&
    !hasDuration &&
    !hasCondition &&
    !hasDescription &&
    !hasImageUrl &&
    !hasTools &&
    !hasIngredients &&
    !hasSeasonings &&
    !hasSteps &&
    !hasIrreplaceableIngredients
  );
}

/**
 * 여러 레시피 업데이트 요청 데이터 검증
 * @param recipes - 검증할 레시피 데이터 배열
 * @returns 검증 결과
 */
export function validateRecipeUpdateRequests(
  recipes: RecipeUpdateRequest[]
): RecipeValidationResult {
  const allErrors: RecipeValidationError[] = [];

  recipes.forEach(recipe => {
    const result = validateRecipeUpdateRequest(recipe);
    allErrors.push(...result.errors);
  });

  return {
    errors: allErrors,
    isValid: allErrors.length === 0,
  };
}

/**
 * 필드명을 사용자 친화적인 이름으로 변환
 */
function getFieldDisplayName(field: string): string {
  const fieldMap: Record<string, string> = {
    conditionId: '유저 컨디션',
    description: '후킹 타이틀',
    duration: '조리 시간',
    imageUrl: '대표 이미지',
    ingredients: '재료',
    seasonings: '양념',
    steps: '요리순서',
    title: '레시피 타이틀',
    tools: '조리도구',
  };

  // steps[index].summary -> step{index+1} 요약
  const stepSummaryMatch = field.match(/^steps\[(\d+)\]\.summary$/);
  if (stepSummaryMatch) {
    const stepNum = parseInt(stepSummaryMatch[1], 10) + 1;
    return `step${stepNum} 요약`;
  }

  // steps[index].content -> step{index+1} 내용
  const stepContentMatch = field.match(/^steps\[(\d+)\]\.content$/);
  if (stepContentMatch) {
    const stepNum = parseInt(stepContentMatch[1], 10) + 1;
    return `step${stepNum} 내용`;
  }

  // steps[index].imageUrl -> step{index+1} 이미지
  const stepImageMatch = field.match(/^steps\[(\d+)\]\.imageUrl$/);
  if (stepImageMatch) {
    const stepNum = parseInt(stepImageMatch[1], 10) + 1;
    return `step${stepNum} 이미지`;
  }

  // ingredients[index].amount -> 재료{index+1} 양
  const ingredientAmountMatch = field.match(/^ingredients\[(\d+)\]\.amount$/);
  if (ingredientAmountMatch) {
    const index = parseInt(ingredientAmountMatch[1], 10) + 1;
    return `재료${index} 양`;
  }

  // seasonings[index].amount -> 양념{index+1} 양
  const seasoningAmountMatch = field.match(/^seasonings\[(\d+)\]\.amount$/);
  if (seasoningAmountMatch) {
    const index = parseInt(seasoningAmountMatch[1], 10) + 1;
    return `양념${index} 양`;
  }

  if (field in fieldMap) {
    return fieldMap[field] ?? field;
  }
  return field;
}

/**
 * 검증 에러를 사용자 친화적인 메시지로 변환
 * @param errors - 검증 에러 배열
 * @returns 에러 메시지 문자열 배열 (각 메시지는 독립적으로 표시)
 */
export function formatValidationErrors(
  errors: RecipeValidationError[]
): string[] {
  if (errors.length === 0) {
    return [];
  }

  // 에러 타입별로 그룹화
  const errorsByType = errors.reduce(
    (acc, error) => {
      if (!acc[error.errorType]) {
        acc[error.errorType] = [];
      }
      acc[error.errorType].push(error);
      return acc;
    },
    {} as Record<'missing' | 'format', RecipeValidationError[]>
  );

  const messages: string[] = [];

  // 'missing' 타입 에러 처리 (데이터 미등록)
  // 형식: "#{누락 컬럼명},#{누락 컬럼명} ... 데이터 미등록"
  if (errorsByType.missing && errorsByType.missing.length > 0) {
    const fields = errorsByType.missing
      .map(error => getFieldDisplayName(error.field))
      .join(', ');
    messages.push(`${fields} 데이터 미등록`);
  }

  // 'format' 타입 에러 처리 (입력 형식이 다릅니다)
  // 형식: "#{오류 컬럼명}의 입력 형식이 다릅니다"
  if (errorsByType.format && errorsByType.format.length > 0) {
    const fields = errorsByType.format
      .map(error => getFieldDisplayName(error.field))
      .join(', ');
    messages.push(`${fields}의 입력 형식이 다릅니다`);
  }

  return messages;
}
