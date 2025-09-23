import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { mood } = body;

    // 기분 상태 유효성 검사
    if (!mood || !['bad', 'neutral', 'good'].includes(mood)) {
      return NextResponse.json(
        {
          message: '유효하지 않은 기분 상태입니다.',
          success: false,
        },
        { status: 400 }
      );
    }

    // TODO: 실제 서버 로직 구현
    // 예: 데이터베이스에 저장, 다른 서비스와 연동 등
    console.info('사용자 기분 상태 저장:', { mood });

    return NextResponse.json({
      data: { mood },
      message: '기분 상태가 성공적으로 저장되었습니다.',
      success: true,
    });
  } catch (error) {
    console.error('기분 상태 저장 오류:', error);
    return NextResponse.json(
      {
        message: '서버 오류가 발생했습니다.',
        success: false,
      },
      { status: 500 }
    );
  }
}
