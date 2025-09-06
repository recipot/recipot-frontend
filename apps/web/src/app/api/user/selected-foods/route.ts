import { NextResponse } from 'next/server';

import { mockFoods } from '@/mocks/data/foods.mock';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { selectedFoodIds } = body;

    if (!selectedFoodIds || !Array.isArray(selectedFoodIds)) {
      return NextResponse.json(
        {
          message: '선택된 재료 정보가 올바르지 않습니다.',
          success: false,
        },
        { status: 400 }
      );
    }

    if (selectedFoodIds.length < 2) {
      return NextResponse.json(
        {
          message: '재료를 2개 이상 선택해주세요.',
          success: false,
        },
        { status: 400 }
      );
    }

    // 선택된 재료가 실제 존재하는지 검증
    const validFoodIds = selectedFoodIds.filter(id =>
      mockFoods.some(food => food.id === id)
    );

    if (validFoodIds.length !== selectedFoodIds.length) {
      return NextResponse.json(
        {
          message: '존재하지 않는 재료가 포함되어 있습니다.',
          success: false,
        },
        { status: 400 }
      );
    }

    // 성공 응답 (실제로는 서버에서 레시피 추천 로직 실행)
    return NextResponse.json({
      data: {
        selectedFoodIds: validFoodIds,
        submittedAt: new Date().toISOString(),
      },
      message: '선택된 재료가 성공적으로 전송되었습니다.',
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        message: '서버 오류가 발생했습니다.',
        success: false,
      },
      { status: 500 }
    );
  }
}
