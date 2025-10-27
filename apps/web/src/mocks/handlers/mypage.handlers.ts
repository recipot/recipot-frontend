import { http, HttpResponse } from 'msw';

import {
  mockCookedRecipes,
  mockDefaultRecipes,
  mockUser,
  mockRestrictions,
} from '../data/myPage.mock';
import type { CompletedRecipe } from '@recipot/api';

// 유틸리티 함수: 레시피 목록 응답 구조 생성
const createRecipeListResponse = (
  items: CompletedRecipe[],
  page = 1,
  limit = 10
) => {
  // 간단한 페이지네이션 로직 시뮬레이션
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    data: {
      items: paginatedItems,
      total: items.length,
      page,
      limit,
    },
    message: '성공적으로 조회했습니다.',
    success: true,
  };
};

// 유틸리티 함수: 단일 성공 응답
const createSuccessResponse = (message: string) => ({
  data: null,
  message,
  success: true,
});

export const mypageHandlers = [
  // 내가 만든 요리 목록 조회 (useCompletedRecipes)
  http.get('/api/v1/users/recipes/completed', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const size = Number(url.searchParams.get('size') || 10);

    return HttpResponse.json(
      createRecipeListResponse(mockCookedRecipes, page, size),
      { status: 200 }
    );
  }),

  // 최근 본 레시피 목록 조회 (useRecentRecipes)
  http.get('/api/v1/users/recipes/recent', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const size = Number(url.searchParams.get('size') || 10);

    return HttpResponse.json(
      createRecipeListResponse(mockDefaultRecipes, page, size),
      { status: 200 }
    );
  }),

  // 보관된 레시피 목록 조회 (STORED_RECIPES_QUERY_KEY)
  http.get('/api/v1/users/recipes/bookmarks', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const size = Number(url.searchParams.get('size') || 10);

    return HttpResponse.json(
      createRecipeListResponse(mockDefaultRecipes, page, size),
      { status: 200 }
    );
  }),

  // 보관 레시피 등록 (usePostStoredRecipe)
  http.post('/api/v1/users/recipes/bookmarks', async ({ request }) => {
    const body = (await request.json()) as { recipeId: number };
    const { recipeId } = body;

    // 실제로는 DB에 추가하는 로직
    console.log(`레시피 ID ${recipeId} 북마크 등록 시도`);

    return HttpResponse.json(
      createSuccessResponse(`레시피 ID ${recipeId} 북마크 등록 성공`),
      { status: 200 }
    );
  }),

  // 보관 레시피 삭제 (useDeleteStoredRecipe)
  http.delete(
    '/api/v1/users/recipes/bookmarks/:recipeId',
    async ({ params }) => {
      const { recipeId } = params;
      console.log(`레시피 ID ${recipeId} 북마크 해제 시도`);

      return HttpResponse.json(
        createSuccessResponse(`레시피 ID ${recipeId} 북마크 해제 성공`),
        { status: 200 }
      );
    }
  ),

  // 못 먹는 음식 목록 조회
  http.get('/api/v1/users/user/restrictions', async () => {
    return HttpResponse.json(
      {
        data: mockRestrictions,
        message: '못 먹는 음식 목록을 성공적으로 조회했습니다.',
        success: true,
      },
      { status: 200 }
    );
  }),
];
