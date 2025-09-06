import { http, HttpResponse } from 'msw';
import { mockFoods } from '../data/foods.mock';

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

      if (!selectedFoodIds || !Array.isArray(selectedFoodIds)) {
        return HttpResponse.json(
          {
            success: false,
            message: '선택된 재료 정보가 올바르지 않습니다.',
          },
          { status: 400 }
        );
      }

      if (selectedFoodIds.length < 2) {
        return HttpResponse.json(
          {
            success: false,
            message: '재료를 2개 이상 선택해주세요.',
          },
          { status: 400 }
        );
      }

      // 선택된 재료가 실제 존재하는지 검증
      const validFoodIds = selectedFoodIds.filter(id =>
        mockFoods.some(food => food.id === id)
      );

      if (validFoodIds.length !== selectedFoodIds.length) {
        return HttpResponse.json(
          {
            success: false,
            message: '존재하지 않는 재료가 포함되어 있습니다.',
          },
          { status: 400 }
        );
      }

      // 성공 응답 (실제로는 서버에서 레시피 추천 로직 실행)
      return HttpResponse.json({
        success: true,
        message: '선택된 재료가 성공적으로 전송되었습니다.',
        data: {
          selectedFoodIds: validFoodIds,
          submittedAt: new Date().toISOString(),
        },
      });
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
