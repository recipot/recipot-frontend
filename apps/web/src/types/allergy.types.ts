/**
 * UI에서 사용하는 카테고리 타입
 */
export type UICategory =
  | 'seafood'
  | 'meat'
  | 'nuts'
  | 'grains'
  | 'dairy'
  | 'others';

/**
 * 백엔드 API 응답 타입
 */
export interface RestrictedIngredient {
  id: number;
  name: string;
  categoryName: string;
  isUserRestricted: boolean;
}

/**
 * 백엔드 API 응답 래퍼
 */
export interface RestrictedIngredientsResponse {
  status: number;
  data: {
    data: RestrictedIngredient[];
  };
}

/**
 * 알레르기 체크 아이템 (UI용)
 */
export interface AllergyCheckItem {
  id: number;
  label: string;
  linkedIngredientIds: number[];
  isUserRestricted?: boolean;
}

/**
 * 카테고리별 알레르기 항목 (UI용)
 */
export interface AllergyCategory {
  type: UICategory;
  title: string;
  items: AllergyCheckItem[];
}

/**
 * 카테고리 메타데이터
 */
export interface CategoryMetadata {
  type: UICategory;
  title: string;
}
