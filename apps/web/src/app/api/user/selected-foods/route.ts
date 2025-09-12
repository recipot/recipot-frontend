import { NextResponse } from 'next/server';

import { validateAndProcessSelectedFoods } from '@/utils/selectedFoodsValidation';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { selectedFoodIds } = body;

    const result = validateAndProcessSelectedFoods(selectedFoodIds);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
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
