import { NextResponse } from 'next/server';

import { mockFoods } from '@/mocks/data/foods.mock';

export async function GET() {
  return NextResponse.json({
    data: mockFoods,
    message: '재료 목록을 성공적으로 조회했습니다.',
    success: true,
  });
}
