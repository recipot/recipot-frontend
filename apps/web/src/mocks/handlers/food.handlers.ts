import { http, HttpResponse } from 'msw';
import { mockFoods } from '../data/foods.mock';
import { validateAndProcessSelectedFoods } from '@/utils/selectedFoodsValidation';

export const foodHandlers = [
  // 재료 목록 조회
  http.get('/api/foods', () => {
    return HttpResponse.json({
      success: true,
      data: mockFoods,
      message: '재료 목록을 성공적으로 조회했습니다.',
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
          success: false,
          message: '서버 오류가 발생했습니다.',
        },
        { status: 500 }
      );
    }
  }),
];
