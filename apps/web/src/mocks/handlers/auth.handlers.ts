import { delay, http, HttpResponse } from 'msw';

import { mockDietaryRestrictions, mockUsers } from '../data/users.mock';

import type { mockHealthStatus } from '../data/users.mock';

export const authHandlers = [
  // 카카오 로그인
  http.post('/api/auth/kakao', async ({ request }) => {
    const { code } = (await request.json()) as { code?: string };

    if (!code) {
      return HttpResponse.json({ error: '카카오 인증 코드가 필요합니다.' }, { status: 400 });
    }

    const user = mockUsers.find((u) => u.provider === 'kakao');
    await delay(1000);
    return HttpResponse.json(
      {
        accessToken: `kakao_mock_token_${Date.now()}`,
        expiresIn: 3600,
        refreshToken: `kakao_mock_refresh_${Date.now()}`,
        user,
      },
      { status: 200 },
    );
  }),

  // 구글 로그인
  http.post('/api/auth/google', async ({ request }) => {
    const { token } = (await request.json()) as { token?: string };

    if (!token) {
      return HttpResponse.json({ error: '구글 토큰이 필요합니다.' }, { status: 400 });
    }

    const user = mockUsers.find((u) => u.provider === 'google');
    await delay(800);
    return HttpResponse.json(
      {
        accessToken: `google_mock_token_${Date.now()}`,
        expiresIn: 3600,
        refreshToken: `google_mock_refresh_${Date.now()}`,
        user,
      },
      { status: 200 },
    );
  }),

  // 로그아웃
  http.post('/api/auth/logout', async () => {
    await delay(300);
    return HttpResponse.json({ message: '로그아웃되었습니다.', success: true }, { status: 200 });
  }),

  // 토큰 갱신
  http.post('/api/auth/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken?: string };

    if (!refreshToken?.includes('mock_refresh')) {
      return HttpResponse.json({ error: '유효하지 않은 리프레시 토큰입니다.' }, { status: 401 });
    }

    await delay(500);
    return HttpResponse.json({ accessToken: `refreshed_token_${Date.now()}`, expiresIn: 3600 }, { status: 200 });
  }),

  // 사용자 정보 조회
  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.includes('mock_token')) {
      return HttpResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    await delay(300);
    return HttpResponse.json({ user: mockUsers[0] }, { status: 200 });
  }),

  // 온보딩: 못먹는 음식 선택지 조회
  http.get('/api/onboarding/dietary-restrictions', async () => {
    await delay(500);
    return HttpResponse.json({ restrictions: mockDietaryRestrictions }, { status: 200 });
  }),

  // 온보딩: 못먹는 음식 저장
  http.post('/api/onboarding/dietary', async ({ request }) => {
    const { restrictions } = (await request.json()) as { restrictions?: string[] };

    if (!Array.isArray(restrictions)) {
      return HttpResponse.json({ error: '잘못된 데이터 형식입니다.' }, { status: 400 });
    }

    await delay(600);
    return HttpResponse.json(
      {
        message: '못먹는 음식이 저장되었습니다.',
        savedRestrictions: restrictions,
        success: true,
      },
      { status: 200 },
    );
  }),

  // 온보딩: 상태 선택 저장 
  http.post('/api/onboarding/health-status', async ({ request }) => {
    const healthStatus = (await request.json()) as typeof mockHealthStatus;
    await delay(700);
    return HttpResponse.json(
      { message: '건강 상태가 저장되었습니다.', savedStatus: healthStatus, success: true },
      { status: 200 },
    );
  }),

  // 온보딩 완료
  http.post('/api/onboarding/complete/:userId', async ({ params }) => {
    const { userId } = params as { userId: string };
    await delay(500);
    return HttpResponse.json(
      { completedAt: new Date(), message: '온보딩이 완료되었습니다!', success: true, userId },
      { status: 200 },
    );
  }),

  // 온보딩 상태 확인
  http.get('/api/onboarding/status/:userId', async ({ params }) => {
    const { userId } = params as { userId: string };
    const isCompleted = userId === '1';
    await delay(400);
    return HttpResponse.json(
      {
        completedAt: isCompleted ? new Date('2024-08-01') : null,
        isCompleted,
        steps: {
          dietaryRestrictions: isCompleted,
          healthStatus: isCompleted,
        },
        userId,
      },
      { status: 200 },
    );
  }),

  // 에러 시뮬레이션을 위한 핸들러 (개발/테스트용)
  http.post('/api/auth/error-test', async () => {
    await delay(1000);
    return HttpResponse.json(
      { code: 'INTERNAL_SERVER_ERROR', error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }),

  // 네트워크 에러 시뮬레이션
  http.post('/api/auth/network-error', async () => {
    // v2에서는 네트워크 에러 전용 헬퍼가 없으므로 지연 후 에러 응답으로 대체
    await delay(10);
    return HttpResponse.json({ error: '네트워크 연결에 실패했습니다.' }, { status: 503 });
  }),
];