import { Recipe, RecipeRecommendResponse } from '@/types/recipe.types';
import { http, HttpResponse } from 'msw';

// 목 데이터
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: '고사리나물\n밥도둑 레시피',
    subtitle: '전통 한식',
    time: '15분',
    cookware: '냄비',
    image: '/backgroundImage.jpg',
    description: '고사리나물로 만드는 전통 한식 레시피입니다.',
  },
  {
    id: 2,
    title: '김치볶음밥\n5분이면 완성!',
    subtitle: '간단한 한끼',
    time: '5분',
    cookware: '프라이팬',
    image: '/backgroundImage.jpg',
    description: '김치볶음밥으로 만드는 간단한 한끼 레시피입니다.',
  },
  {
    id: 3,
    title: '빵 한장에 땅콩버터 바르고\n사과만 얹으면 뚝딱',
    subtitle: '레시피 타이틀 최대 1줄까지',
    time: '99분',
    cookware: '조리도구 최소정보',
    image: '/backgroundImage.jpg',
    description: '빵 한장에 땅콩버터 바르고 사과만 얹으면 뚝딱 완성!',
  },
];

// 선택된 재료 목록 (동적으로 관리)
let mockSelectedIngredients = [
  '땅콩버터',
  '감자',
  '김치',
  '양파',
  '마늘',
  '고추장',
  '된장',
  '대파',
];

// 레시피 추천 핸들러
export const recipeRecommendHandlers = [
  // 레시피 추천 목록 조회
  // TODO : API 나오면 수정 필요
  http.get('/api/recipe-recommend', () => {
    const response: RecipeRecommendResponse = {
      recipes: mockRecipes,
      message: '새로운 레시피가 추천되었어요',
    };

    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // 특정 레시피 상세 조회
  // TODO : API 나오면 수정 필요
  http.get('/api/recipe-recommend/:id', ({ params }) => {
    const { id } = params;
    const recipe = mockRecipes.find(r => r.id === Number(id));

    if (!recipe) {
      return HttpResponse.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(recipe, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // 레시피 좋아요 토글
  // TODO : API 나오면 수정 필요
  http.post('/api/recipe-recommend/:id/like', ({ params }) => {
    const { id } = params;
    const recipe = mockRecipes.find(r => r.id === Number(id));

    if (!recipe) {
      return HttpResponse.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        recipeId: Number(id),
        liked: true,
        message: '레시피를 좋아요했습니다.',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 레시피 좋아요 취소
  // TODO : API 나오면 수정 필요
  http.delete('/api/recipe-recommend/:id/like', ({ params }) => {
    const { id } = params;
    const recipe = mockRecipes.find(r => r.id === Number(id));

    if (!recipe) {
      return HttpResponse.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        recipeId: Number(id),
        liked: false,
        message: '레시피 좋아요를 취소했습니다.',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 선택된 재료 목록 조회 (3개로 제한하고 +N 형태로 표시)
  // TODO : API 나오면 수정 필요
  http.get('/api/selected-ingredients', () => {
    // 3개로 제한하고, 3개보다 많을 경우 +N 형태로 표시
    const displayIngredients = mockSelectedIngredients.slice(0, 3);
    const remainingCount = Math.max(0, mockSelectedIngredients.length - 3);

    if (remainingCount > 0) {
      displayIngredients.push(`+${remainingCount}`);
    }

    return HttpResponse.json(
      {
        selectedIngredients: displayIngredients,
        message: '선택된 재료 목록을 조회했습니다.',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // 선택된 재료 목록 업데이트
  // TODO : API 나오면 수정 필요
  http.put('/api/selected-ingredients', async ({ request }) => {
    try {
      const body = (await request.json()) as { selectedIngredients: string[] };
      mockSelectedIngredients = body.selectedIngredients;

      return HttpResponse.json(
        {
          selectedIngredients: mockSelectedIngredients,
          message: '선택된 재료 목록이 업데이트되었습니다.',
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }
  }),
];
