import { delay, http, HttpResponse } from 'msw';

export const allergyCheckHandlers = [
  // 못 먹는 음식 item POST
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
        message: '못 먹는 음식 item POST 완료',
        selectedItems: categories,
        analysis: {
          totalSelected: categories.length,
          seafoodCount: categories.filter(id => [1, 2, 3, 4, 5].includes(id))
            .length,
          animalCount: categories.filter(id => [6, 7, 8, 9, 10].includes(id))
            .length,
        },
        success: true,
      },
      { status: 200 }
    );
  }),
];
