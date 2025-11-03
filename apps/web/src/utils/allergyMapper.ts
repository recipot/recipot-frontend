import type {
  AllergyCategory,
  AllergyCheckItem,
  CategoryMetadata,
  RestrictedIngredient,
  UICategory,
} from '@/types/allergy.types';

/**
 * 백엔드 카테고리명을 UI 카테고리 키로 매핑
 * 새로운 카테고리가 추가되면 여기에서만 매핑을 업데이트하면 됩니다.
 */
const CATEGORY_NAME_TO_UI_CATEGORY = new Map<string, UICategory>([
  ['계란류', 'meat'],
  ['견과류', 'nuts'],
  ['과일류', 'others'],
  ['곡류', 'grains'],
  ['곡물류', 'grains'],
  ['기타', 'others'],
  ['난류', 'meat'],
  ['소스류', 'others'],
  ['어패류', 'seafood'],
  ['양념/소스', 'others'],
  ['양념류', 'others'],
  ['유제품', 'dairy'],
  ['육류', 'meat'],
  ['육류/계란', 'meat'],
  ['육류 및 계란', 'meat'],
  ['젓갈류', 'seafood'],
  ['젓갈 및 발효식품', 'seafood'],
  ['해산물류', 'seafood'],
]);

const UI_CATEGORY_ORDER: readonly UICategory[] = [
  'dairy',
  'grains',
  'meat',
  'nuts',
  'others',
  'seafood',
] as const;

const normalizeIngredientLabel = (name: string): string => {
  // 괄호 및 괄호 안의 내용을 제거하고 앞뒤 공백을 정리
  const normalized = name.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ');
  const trimmed = normalized.trim();
  return trimmed.length > 0 ? trimmed : name.trim();
};

const mapCategoryNameToUICategory = (
  categoryName: string
): UICategory | null => CATEGORY_NAME_TO_UI_CATEGORY.get(categoryName) ?? null;

/**
 * 백엔드 재료 데이터를 UI 카테고리별로 그룹화
 * @param ingredients - 백엔드에서 받은 재료 목록
 * @returns 카테고리별로 그룹화된 재료 목록
 */
export const groupIngredientsByCategory = (
  ingredients: RestrictedIngredient[]
): Record<UICategory, AllergyCheckItem[]> => {
  const itemsByCategory = new Map<UICategory, AllergyCheckItem[]>();
  const labelIndexByCategory = new Map<UICategory, Map<string, number>>();

  UI_CATEGORY_ORDER.forEach(category => {
    itemsByCategory.set(category, []);
    labelIndexByCategory.set(category, new Map());
  });

  ingredients.forEach(ingredient => {
    const category = mapCategoryNameToUICategory(ingredient.categoryName);
    if (!category) return;

    const normalizedLabel = normalizeIngredientLabel(ingredient.name);
    const categoryItems = itemsByCategory.get(category);
    const labelIndex = labelIndexByCategory.get(category);

    if (!categoryItems || !labelIndex) {
      return;
    }

    const existingIndex = labelIndex.get(normalizedLabel);

    if (existingIndex !== undefined) {
      const existingItem = categoryItems[existingIndex];
      if (!existingItem.linkedIngredientIds.includes(ingredient.id)) {
        existingItem.linkedIngredientIds.push(ingredient.id);
      }
      if (ingredient.isUserRestricted) {
        existingItem.isUserRestricted = true;
      }
      return;
    }

    labelIndex.set(normalizedLabel, categoryItems.length);
    categoryItems.push({
      id: ingredient.id,
      isUserRestricted: ingredient.isUserRestricted,
      label: normalizedLabel,
      linkedIngredientIds: [ingredient.id],
    });
  });

  return {
    dairy: itemsByCategory.get('dairy') ?? [],
    grains: itemsByCategory.get('grains') ?? [],
    meat: itemsByCategory.get('meat') ?? [],
    nuts: itemsByCategory.get('nuts') ?? [],
    others: itemsByCategory.get('others') ?? [],
    seafood: itemsByCategory.get('seafood') ?? [],
  };
};

/**
 * UI에 표시할 카테고리 배열로 변환
 * @param ingredients - 백엔드에서 받은 재료 목록
 * @param categoryMetadata - 카테고리 메타데이터 (순서, 제목)
 * @returns UI에 표시할 카테고리 배열
 */
export const mapIngredientsToCategories = (
  ingredients: RestrictedIngredient[],
  categoryMetadata: CategoryMetadata[]
): AllergyCategory[] => {
  const groupedRecord = groupIngredientsByCategory(ingredients);
  const grouped = new Map<UICategory, AllergyCheckItem[]>([
    ['dairy', groupedRecord.dairy],
    ['grains', groupedRecord.grains],
    ['meat', groupedRecord.meat],
    ['nuts', groupedRecord.nuts],
    ['others', groupedRecord.others],
    ['seafood', groupedRecord.seafood],
  ]);

  const categoryTitles = new Map<UICategory, string>();

  ingredients.forEach(ingredient => {
    const category = mapCategoryNameToUICategory(ingredient.categoryName);
    if (!category || categoryTitles.has(category)) return;
    categoryTitles.set(category, ingredient.categoryName);
  });

  return categoryMetadata
    .map(meta => ({
      items: grouped.get(meta.type) ?? [],
      title: categoryTitles.get(meta.type) ?? meta.title,
      type: meta.type,
    }))
    .filter(category => category.items.length > 0);
};

/**
 * 초기 선택된 항목 ID 목록 추출
 * @param ingredients - 백엔드에서 받은 재료 목록
 * @returns isUserRestricted가 true인 항목의 ID 배열
 */
export const extractInitialSelectedIds = (
  ingredients: RestrictedIngredient[]
): number[] => {
  const grouped = groupIngredientsByCategory(ingredients);
  const initialIds = new Set<number>();

  [
    grouped.dairy,
    grouped.grains,
    grouped.meat,
    grouped.nuts,
    grouped.others,
    grouped.seafood,
  ].forEach(items => {
    items.forEach(item => {
      if (item.isUserRestricted) {
        item.linkedIngredientIds.forEach(id => initialIds.add(id));
      }
    });
  });

  return Array.from(initialIds);
};
