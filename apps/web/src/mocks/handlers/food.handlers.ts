import { delay, http, HttpResponse } from 'msw';

import { validateAndProcessSelectedFoods } from '@/utils/selectedFoodsValidation';

import { mockFoods } from '../data/foods.mock';

export const foodHandlers = [
  // 전체 재료 목록 조회 (새로운 백엔드 API)
  http.get('/v1/ingredients', async () => {
    await delay(300); // 네트워크 지연 시뮬레이션
    return HttpResponse.json(
      {
        data: {
          data: mockFoods,
        },
        status: 200,
      },
      { status: 200 }
    );
  }),

  // 재료 목록 조회 (기존 API - 하위 호환성)
  http.get('/api/foods', () => {
    return HttpResponse.json({
      data: mockFoods,
      message: '재료 목록을 성공적으로 조회했습니다.',
      success: true,
    });
  }),

  // 선택된 재료 전송 (레시피 추천 요청 시)
  http.post('/api/user/selected-foods', async ({ request }) => {
    try {
      const body = (await request.json()) as { selectedFoodIds: number[] };
      const { selectedFoodIds } = body;

      const result = validateAndProcessSelectedFoods(selectedFoodIds);

      if (!result.success) {
        return HttpResponse.json(result, { status: 400 });
      }

      return HttpResponse.json(result);
    } catch (error) {
      return HttpResponse.json(
        {
          message: '서버 오류가 발생했습니다.',
          success: false,
        },
        { status: 500 }
      );
    }
  }),
];
