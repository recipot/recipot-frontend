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
const CATEGORY_NAME_TO_UI_CATEGORY: Record<string, UICategory> = {
  기타: 'others',
  곡류: 'grains',
  곡물류: 'grains',
  과일류: 'others',
  견과류: 'nuts',
  육류: 'meat',
  '육류/계란': 'meat',
  '육류 및 계란': 'meat',
  계란류: 'meat',
  난류: 'meat',
  어패류: 'seafood',
  해산물류: 'seafood',
  젓갈류: 'seafood',
  '젓갈 및 발효식품': 'seafood',
  유제품: 'dairy',
  양념류: 'others',
  '양념/소스': 'others',
  소스류: 'others',
};

const mapCategoryNameToUICategory = (
  categoryName: string
): UICategory | null => {
  return CATEGORY_NAME_TO_UI_CATEGORY[categoryName] ?? null;
};

/**
 * 백엔드 재료 데이터를 UI 카테고리별로 그룹화
 * @param ingredients - 백엔드에서 받은 재료 목록
 * @returns 카테고리별로 그룹화된 재료 목록
 */
export const groupIngredientsByCategory = (
  ingredients: RestrictedIngredient[]
): Record<UICategory, AllergyCheckItem[]> => {
  const grouped: Record<UICategory, AllergyCheckItem[]> = {
    dairy: [],
    grains: [],
    meat: [],
    nuts: [],
    others: [],
    seafood: [],
  };

  ingredients.forEach(ingredient => {
    const category = mapCategoryNameToUICategory(ingredient.categoryName);
    if (!category) return;
    grouped[category].push({
      id: ingredient.id,
      isUserRestricted: ingredient.isUserRestricted,
      label: ingredient.name,
    });
  });

  return grouped;
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
  const grouped = groupIngredientsByCategory(ingredients);
  const categoryTitles: Partial<Record<UICategory, string>> = {};

  ingredients.forEach(ingredient => {
    const category = mapCategoryNameToUICategory(ingredient.categoryName);
    if (!category) return;
    if (!categoryTitles[category]) {
      categoryTitles[category] = ingredient.categoryName;
    }
  });

  return categoryMetadata
    .map(meta => ({
      items: grouped[meta.type] || [],
      title: categoryTitles[meta.type] ?? meta.title,
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
  return ingredients
    .filter(ingredient => {
      const category = mapCategoryNameToUICategory(ingredient.categoryName);
      return category && ingredient.isUserRestricted;
    })
    .map(ingredient => ingredient.id);
};
