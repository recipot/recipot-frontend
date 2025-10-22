import type {
  AllergyCategory,
  AllergyCheckItem,
  CategoryMetadata,
  RestrictedIngredient,
  UICategory,
} from '@/types/allergy.types';

/**
 * 재료명 → UI 카테고리 맵핑 테이블
 * 백엔드에 새 재료가 추가되면 여기에도 추가해야 합니다
 */
export const INGREDIENT_TO_CATEGORY_MAP: Record<string, UICategory> = {
  // 어패류
  고등어: 'seafood',
  굴: 'seafood',
  멸치: 'seafood',
  명란젓: 'seafood',
  바지락: 'seafood',
  새우: 'seafood',
  새우젓: 'seafood',
  액젓: 'seafood',
  연어: 'seafood',
  오징어: 'seafood',
  젓갈류: 'seafood',
  참치: 'seafood',
  홍합: 'seafood',

  // 육류/계란
  가공육: 'meat',
  계란: 'meat',
  닭고기: 'meat',
  돼지고기: 'meat',
  메추리알: 'meat',
  베이컨: 'meat',
  소시지: 'meat',
  쇠고기: 'meat',
  오리고기: 'meat',
  햄: 'meat',

  // 견과류
  땅콩: 'nuts',
  잣: 'nuts',
  캐슈넛: 'nuts',
  피스타치오: 'nuts',
  호두: 'nuts',

  // 곡류
  국수면: 'grains',
  만두: 'grains',
  메밀가루: 'grains',
  메밀면: 'grains',
  밀가루: 'grains',
  부침가루: 'grains',
  빵: 'grains',
  파스타면: 'grains',

  // 유제품
  버터: 'dairy',
  요거트: 'dairy',
  우유: 'dairy',
  치즈: 'dairy',

  // 기타
  게맛살: 'others',
  땅콩버터: 'others',
  마라: 'others',
  마요네즈: 'others',
  배: 'others',
  복숭아: 'others',
  사과: 'others',
  어묵: 'others',
};

/**
 * 재료명을 UI 카테고리로 맵핑
 * @param ingredientName - 재료명
 * @returns UI 카테고리 타입
 */
export const mapIngredientToCategory = (ingredientName: string): UICategory => {
  return INGREDIENT_TO_CATEGORY_MAP[ingredientName] || 'others';
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
    const category = mapIngredientToCategory(ingredient.name);
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

  return categoryMetadata.map(meta => ({
    items: grouped[meta.type] || [],
    title: meta.title,
    type: meta.type,
  }));
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
    .filter(ingredient => ingredient.isUserRestricted)
    .map(ingredient => ingredient.id);
};
