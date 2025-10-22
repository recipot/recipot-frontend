import { z } from 'zod';

import type { CategoryMetadata } from '@/types/allergy.types';

/**
 * UI 카테고리 메타데이터
 * 카테고리의 순서와 제목만 관리합니다.
 * 실제 재료 목록은 백엔드 API에서 가져옵니다.
 */
export const CATEGORY_METADATA: CategoryMetadata[] = [
  { title: '어패류', type: 'seafood' },
  { title: '육류/계란', type: 'meat' },
  { title: '견과류', type: 'nuts' },
  { title: '곡류', type: 'grains' },
  { title: '유제품', type: 'dairy' },
  { title: '기타', type: 'others' },
];

export const AllergyFormSchema = z.object({
  items: z.array(z.number()),
});
