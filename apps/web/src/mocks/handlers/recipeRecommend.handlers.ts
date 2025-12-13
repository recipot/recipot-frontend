import {
  Recipe,
  RecipeRecommendResponse,
} from '@/app/recipe/[id]/types/recipe.types';
import { http, HttpResponse } from 'msw';

// 목 데이터
const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: '고사리나물\n밥도둑 레시피',
    duration: '15분',
    tools: [{ id: 1, imageUrl: '/backgroundImage.jpg', name: '냄비' }],
    description: '고사리나물로 만드는 전통 한식 레시피입니다.',
    healthPoint: { content: '비타민 A가 풍부해 눈 건강에 좋아요' },
    images: [
      { id: 1, imageUrl: '/recipeImage.png' },
      { id: 2, imageUrl: '/backgroundImage.jpg' },
    ],
    seasonings: [
      { id: 1, name: '소금', amount: '1작은술' },
      { id: 2, name: '참기름', amount: '1큰술' },
      { id: 3, name: '마늘', amount: '2쪽' },
    ],
    isBookmarked: false,
    ingredients: {
      owned: [
        { id: 1, name: '고사리', amount: '200g', isAlternative: false },
        { id: 2, name: '마늘', amount: '2쪽', isAlternative: false },
      ],
      notOwned: [
        { id: 3, name: '참기름', amount: '1큰술', isAlternative: false },
      ],
      alternativeUnavailable: [],
    },
    steps: [
      {
        orderNum: 1,
        step: 1,
        summary: '고사리를 깨끗이 씻어 물기를 빼주세요',
        content: '고사리를 깨끗이 씻어 물기를 빼주세요',
        imageUrl: null,
      },
      {
        orderNum: 2,
        step: 2,
        summary: '마늘을 다져서 팬에 볶아주세요',
        content: '마늘을 다져서 팬에 볶아주세요',
        imageUrl: null,
      },
      {
        orderNum: 3,
        step: 3,
        summary: '고사리를 넣고 볶다가 참기름을 넣어 마무리하세요',
        content: '고사리를 넣고 볶다가 참기름을 넣어 마무리하세요',
        imageUrl: null,
      },
    ],
  },
  {
    id: 2,
    title: '김치볶음밥\n5분이면 완성!',
    duration: '5분',
    tools: [{ id: 1, imageUrl: '/backgroundImage.jpg', name: '프라이팬' }],
    description: '김치볶음밥으로 만드는 간단한 한끼 레시피입니다.',
    healthPoint: { content: '김치의 유산균이 장 건강에 좋아요' },
    images: [{ id: 1, imageUrl: '/recipeImage.png' }],
    seasonings: [
      { id: 1, name: '김치국물', amount: '2큰술' },
      { id: 2, name: '식용유', amount: '1큰술' },
    ],
    isBookmarked: true,
    ingredients: {
      owned: [
        { id: 1, name: '밥', amount: '1공기', isAlternative: false },
        { id: 2, name: '김치', amount: '1/2컵', isAlternative: false },
      ],
      notOwned: [{ id: 3, name: '계란', amount: '1개', isAlternative: false }],
      alternativeUnavailable: [],
    },
    steps: [
      {
        orderNum: 1,
        step: 1,
        summary: '팬에 식용유를 두르고 김치를 볶아주세요',
        content: '팬에 식용유를 두르고 김치를 볶아주세요',
        imageUrl: null,
      },
      {
        orderNum: 2,
        step: 2,
        summary: '밥을 넣고 김치국물을 넣어 볶아주세요',
        content: '밥을 넣고 김치국물을 넣어 볶아주세요',
        imageUrl: null,
      },
      {
        orderNum: 3,
        step: 3,
        summary: '계란을 풀어서 넣고 마무리하세요',
        content: '계란을 풀어서 넣고 마무리하세요',
        imageUrl: null,
      },
    ],
  },
  {
    id: 3,
    title: '빵 한장에 땅콩버터 바르고\n사과만 얹으면 뚝딱',
    duration: '3분',
    tools: [
      { id: 1, imageUrl: '/backgroundImage.jpg', name: '조리도구 최소정보' },
    ],
    description: '빵 한장에 땅콩버터 바르고 사과만 얹으면 뚝딱 완성!',
    healthPoint: { content: '땅콩의 단백질이 풍부해요' },
    images: [{ id: 1, imageUrl: '/recipeImage.png' }],
    seasonings: [],
    isBookmarked: false,
    ingredients: {
      owned: [
        { id: 1, name: '식빵', amount: '1장', isAlternative: false },
        { id: 2, name: '땅콩버터', amount: '2큰술', isAlternative: false },
        { id: 3, name: '사과', amount: '1/2개', isAlternative: false },
      ],
      notOwned: [],
      alternativeUnavailable: [],
    },
    steps: [
      {
        orderNum: 1,
        step: 1,
        summary: '식빵에 땅콩버터를 고르게 발라주세요',
        content: '식빵에 땅콩버터를 고르게 발라주세요',
        imageUrl: null,
      },
      {
        orderNum: 2,
        step: 2,
        summary: '사과를 얇게 썰어서 땅콩버터 위에 올려주세요',
        content: '사과를 얇게 썰어서 땅콩버터 위에 올려주세요',
        imageUrl: null,
      },
    ],
  },
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
];
