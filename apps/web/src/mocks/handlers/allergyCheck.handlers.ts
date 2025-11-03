import { delay, http, HttpResponse } from 'msw';

// Mock 재료 데이터 (백엔드와 동일한 구조)
const mockIngredients = [
  // 해산물류
  { categoryName: '해산물류', id: 1, isUserRestricted: false, name: '참치' },
  { categoryName: '해산물류', id: 2, isUserRestricted: false, name: '고등어' },
  { categoryName: '해산물류', id: 3, isUserRestricted: false, name: '멸치' },
  { categoryName: '해산물류', id: 4, isUserRestricted: false, name: '오징어' },
  { categoryName: '해산물류', id: 5, isUserRestricted: false, name: '굴' },
  { categoryName: '해산물류', id: 6, isUserRestricted: false, name: '바지락' },
  { categoryName: '해산물류', id: 7, isUserRestricted: false, name: '젓갈류' },
  { categoryName: '해산물류', id: 8, isUserRestricted: false, name: '연어' },
  { categoryName: '해산물류', id: 9, isUserRestricted: false, name: '새우' },
  { categoryName: '해산물류', id: 10, isUserRestricted: false, name: '홍합' },
  { categoryName: '해산물류', id: 11, isUserRestricted: false, name: '새우젓' },
  {
    categoryName: '젓갈 및 발효식품',
    id: 12,
    isUserRestricted: false,
    name: '명란젓',
  },
  { categoryName: '해산물류', id: 13, isUserRestricted: false, name: '액젓' },

  // 육류/계란
  {
    categoryName: '육류 및 계란',
    id: 14,
    isUserRestricted: false,
    name: '닭고기',
  },
  {
    categoryName: '육류 및 계란',
    id: 15,
    isUserRestricted: false,
    name: '돼지고기',
  },
  {
    categoryName: '육류 및 계란',
    id: 16,
    isUserRestricted: false,
    name: '쇠고기',
  },
  {
    categoryName: '육류 및 계란',
    id: 17,
    isUserRestricted: false,
    name: '계란',
  },
  {
    categoryName: '육류 및 계란',
    id: 18,
    isUserRestricted: false,
    name: '메추리알',
  },
  {
    categoryName: '육류 및 계란',
    id: 19,
    isUserRestricted: false,
    name: '가공육',
  },
  {
    categoryName: '육류 및 계란',
    id: 20,
    isUserRestricted: false,
    name: '오리고기',
  },
  {
    categoryName: '육류 및 계란',
    id: 21,
    isUserRestricted: false,
    name: '햄',
  },
  {
    categoryName: '육류 및 계란',
    id: 22,
    isUserRestricted: false,
    name: '소시지',
  },
  {
    categoryName: '육류 및 계란',
    id: 23,
    isUserRestricted: false,
    name: '베이컨',
  },

  // 견과류
  { categoryName: '견과류', id: 24, isUserRestricted: false, name: '땅콩' },
  { categoryName: '견과류', id: 25, isUserRestricted: false, name: '호두' },
  { categoryName: '견과류', id: 26, isUserRestricted: false, name: '캐슈넛' },
  { categoryName: '견과류', id: 27, isUserRestricted: false, name: '피스타치오' },
  { categoryName: '견과류', id: 28, isUserRestricted: false, name: '잣' },

  // 곡류
  { categoryName: '곡류', id: 29, isUserRestricted: false, name: '밀가루' },
  { categoryName: '곡류', id: 30, isUserRestricted: false, name: '메밀가루' },
  { categoryName: '곡류', id: 31, isUserRestricted: false, name: '부침가루' },
  { categoryName: '곡류', id: 32, isUserRestricted: false, name: '국수면' },
  { categoryName: '곡류', id: 33, isUserRestricted: false, name: '파스타면' },
  { categoryName: '곡류', id: 34, isUserRestricted: false, name: '만두' },
  { categoryName: '곡류', id: 35, isUserRestricted: false, name: '빵' },
  { categoryName: '곡류', id: 36, isUserRestricted: false, name: '메밀면' },

  // 유제품
  { categoryName: '유제품', id: 37, isUserRestricted: false, name: '우유' },
  { categoryName: '유제품', id: 38, isUserRestricted: false, name: '치즈' },
  { categoryName: '유제품', id: 39, isUserRestricted: false, name: '버터' },
  { categoryName: '유제품', id: 40, isUserRestricted: false, name: '요거트' },

  // 기타
  { categoryName: '기타', id: 41, isUserRestricted: false, name: '어묵' },
  { categoryName: '기타', id: 42, isUserRestricted: false, name: '게맛살' },
  { categoryName: '소스류', id: 43, isUserRestricted: false, name: '땅콩버터' },
  { categoryName: '기타', id: 44, isUserRestricted: false, name: '복숭아' },
  { categoryName: '기타', id: 45, isUserRestricted: false, name: '사과' },
  { categoryName: '기타', id: 46, isUserRestricted: false, name: '배' },
  { categoryName: '소스류', id: 47, isUserRestricted: false, name: '마라' },
  { categoryName: '소스류', id: 48, isUserRestricted: false, name: '마요네즈' },
];

export const allergyCheckHandlers = [
  // 못 먹는 재료 목록 조회 (새로운 API)
  http.get('/v1/ingredients/restricted', async () => {
    await delay(600);
    return HttpResponse.json(
      {
        data: {
          data: mockIngredients,
        },
        status: 200,
      },
      { status: 200 }
    );
  }),

  // 못 먹는 재료 저장 (새로운 API)
  http.post('/v1/users/ingredients/unavailable', async ({ request }) => {
    const { ingredientIds } = (await request.json()) as {
      ingredientIds: number[];
    };

    if (!Array.isArray(ingredientIds)) {
      return HttpResponse.json(
        { error: '잘못된 데이터 형식입니다.' },
        { status: 400 }
      );
    }

    await delay(600);
    return HttpResponse.json(
      {
        data: {
          message: '못 먹는 재료 저장 완료',
          savedIngredientIds: ingredientIds,
        },
        status: 200,
      },
      { status: 200 }
    );
  }),
];
