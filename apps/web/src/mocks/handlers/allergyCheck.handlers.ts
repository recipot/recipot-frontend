import { delay, http, HttpResponse } from 'msw';

// Mock 재료 데이터 (백엔드와 동일한 구조)
const mockIngredients = [
  // 어패류
  { id: 1, isUserRestricted: false, name: '참치' },
  { id: 2, isUserRestricted: false, name: '고등어' },
  { id: 3, isUserRestricted: false, name: '멸치' },
  { id: 4, isUserRestricted: false, name: '오징어' },
  { id: 5, isUserRestricted: false, name: '굴' },
  { id: 6, isUserRestricted: false, name: '바지락' },
  { id: 7, isUserRestricted: false, name: '젓갈류' },
  { id: 8, isUserRestricted: false, name: '연어' },
  { id: 9, isUserRestricted: false, name: '새우' },
  { id: 10, isUserRestricted: false, name: '홍합' },
  { id: 11, isUserRestricted: false, name: '새우젓' },
  { id: 12, isUserRestricted: false, name: '명란젓' },
  { id: 13, isUserRestricted: false, name: '액젓' },

  // 육류/계란
  { id: 14, isUserRestricted: false, name: '닭고기' },
  { id: 15, isUserRestricted: false, name: '돼지고기' },
  { id: 16, isUserRestricted: false, name: '쇠고기' },
  { id: 17, isUserRestricted: false, name: '계란' },
  { id: 18, isUserRestricted: false, name: '메추리알' },
  { id: 19, isUserRestricted: false, name: '가공육' },
  { id: 20, isUserRestricted: false, name: '오리고기' },
  { id: 21, isUserRestricted: false, name: '햄' },
  { id: 22, isUserRestricted: false, name: '소시지' },
  { id: 23, isUserRestricted: false, name: '베이컨' },

  // 견과류
  { id: 24, isUserRestricted: false, name: '땅콩' },
  { id: 25, isUserRestricted: false, name: '호두' },
  { id: 26, isUserRestricted: false, name: '캐슈넛' },
  { id: 27, isUserRestricted: false, name: '피스타치오' },
  { id: 28, isUserRestricted: false, name: '잣' },

  // 곡류
  { id: 29, isUserRestricted: false, name: '밀가루' },
  { id: 30, isUserRestricted: false, name: '메밀가루' },
  { id: 31, isUserRestricted: false, name: '부침가루' },
  { id: 32, isUserRestricted: false, name: '국수면' },
  { id: 33, isUserRestricted: false, name: '파스타면' },
  { id: 34, isUserRestricted: false, name: '만두' },
  { id: 35, isUserRestricted: false, name: '빵' },
  { id: 36, isUserRestricted: false, name: '메밀면' },

  // 유제품
  { id: 37, isUserRestricted: false, name: '우유' },
  { id: 38, isUserRestricted: false, name: '치즈' },
  { id: 39, isUserRestricted: false, name: '버터' },
  { id: 40, isUserRestricted: false, name: '요거트' },

  // 기타
  { id: 41, isUserRestricted: false, name: '어묵' },
  { id: 42, isUserRestricted: false, name: '게맛살' },
  { id: 43, isUserRestricted: false, name: '땅콩버터' },
  { id: 44, isUserRestricted: false, name: '복숭아' },
  { id: 45, isUserRestricted: false, name: '사과' },
  { id: 46, isUserRestricted: false, name: '배' },
  { id: 47, isUserRestricted: false, name: '마라' },
  { id: 48, isUserRestricted: false, name: '마요네즈' },
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
  http.post('/v1/ingredients/restricted', async ({ request }) => {
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

  // 기존 API (하위 호환성 유지)
  http.post('/api/allergy', async ({ request }) => {
    const { categories } = (await request.json()) as { categories: number[] };

    if (!Array.isArray(categories)) {
      return HttpResponse.json(
        { error: '잘못된 데이터 형식입니다.' },
        { status: 400 }
      );
    }

    await delay(600);
    return HttpResponse.json(
      {
        analysis: {
          animalCount: categories.filter(id => [6, 7, 8, 9, 10].includes(id))
            .length,
          seafoodCount: categories.filter(id => [1, 2, 3, 4, 5].includes(id))
            .length,
          totalSelected: categories.length,
        },
        message: '못 먹는 음식 item POST 완료',
        selectedItems: categories,
        success: true,
      },
      { status: 200 }
    );
  }),
];
