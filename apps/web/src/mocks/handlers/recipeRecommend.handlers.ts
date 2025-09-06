import { http, HttpResponse } from 'msw';

// 레시피 추천 API 응답 타입
export interface RecipeRecommendResponse {
  recipes: Recipe[];
  selectedIngredients: string[];
  message: string;
}

export interface Recipe {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  cookware: string;
  image: string;
  description: string;
}

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

const mockSelectedIngredients = ['땅콩버터', '감자', '김치', '+5'];

// 레시피 추천 핸들러
export const recipeRecommendHandlers = [
  // 레시피 추천 목록 조회
  http.get('/api/recipe-recommend', () => {
    const response: RecipeRecommendResponse = {
      recipes: mockRecipes,
      selectedIngredients: mockSelectedIngredients,
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
];
