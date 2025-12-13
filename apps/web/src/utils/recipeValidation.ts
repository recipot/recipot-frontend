import { z } from 'zod';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

export interface RecipeValidationError {
  recipeId: number;
  field: string;
  message: string;
  errorType: 'missing';
}

export interface RecipeValidationResult {
  isValid: boolean;
  errors: RecipeValidationError[];
  fieldNames?: string[];
  errorType?: 'missing'; // 에러가 있을 때만 'missing', 없으면 undefined
}

// Zod 스키마 정의
const RecipeUpdateRequestSchema = z.object({
  conditionId: z.number(),
  description: z.string().min(1),
  duration: z.number(),
  id: z.number(),
  imageUrl: z.string().min(1),
  ingredients: z
    .array(
      z.object({
        amount: z.string().min(1),
        id: z.number(),
        isAlternative: z.boolean(),
      })
    )
    .min(1),
  seasonings: z
    .array(
      z.object({
        amount: z.string().min(1),
        id: z.number(),
      })
    )
    .min(1),
  steps: z
    .array(
      z.object({
        content: z.string().min(1),
        imageUrl: z.string(),
        orderNum: z.number().min(0),
        summary: z.string(),
      })
    )
    .min(1),
  title: z.string().min(1),
  tools: z
    .array(
      z.object({
        id: z.number(),
      })
    )
    .min(1),
});

/**
 * Zod 에러 경로를 필드 경로로 변환
 * 예: ['steps', 0, 'summary'] -> 'steps[0].summary'
 *     ['title'] -> 'title'
 */
function zodPathToFieldPath(path: Array<string | number>): string {
  if (path.length === 0) return '';

  let result = String(path[0]);

  for (let i = 1; i < path.length; i++) {
    const segment = path[i];
    if (typeof segment === 'number') {
      result += `[${segment}]`;
    } else {
      result += `.${segment}`;
    }
  }

  return result;
}

/**
 * 레시피 업데이트 요청 데이터 검증
 * @param recipe - 검증할 레시피 데이터
 * @returns 검증 결과
 */
export function validateRecipeUpdateRequest(
  recipe: RecipeUpdateRequest
): RecipeValidationResult {
  const result = RecipeUpdateRequestSchema.safeParse(recipe);

  if (result.success) {
    return {
      errors: [],
      fieldNames: [],
      isValid: true,
    };
  }

  const errors: RecipeValidationError[] = [];
  const missingFields: string[] = [];

  result.error.issues.forEach(issue => {
    const fieldPath = zodPathToFieldPath(issue.path as Array<string | number>);
    const displayName = getFieldDisplayName(fieldPath);

    errors.push({
      errorType: 'missing',
      field: fieldPath,
      message: issue.message,
      recipeId: recipe.id ?? 0,
    });

    missingFields.push(displayName);
  });

  return {
    errors,
    errorType: 'missing',
    fieldNames: missingFields,
    isValid: false,
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
  const allMissingFields: string[] = [];

  recipes.forEach(recipe => {
    const result = validateRecipeUpdateRequest(recipe);
    allErrors.push(...result.errors);

    if (!result.isValid && result.fieldNames) {
      allMissingFields.push(...result.fieldNames);
    }
  });

  // 중복 제거
  const uniqueMissingFields = Array.from(new Set(allMissingFields));

  const hasErrors = allErrors.length > 0;

  return {
    errors: allErrors,
    errorType: hasErrors ? 'missing' : undefined,
    fieldNames: hasErrors ? uniqueMissingFields : [],
    isValid: !hasErrors,
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

  // 일반 필드 매핑
  if (field in fieldMap) {
    return fieldMap[field] ?? field;
  }

  return field;
}
