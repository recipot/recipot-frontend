import { delay, http, HttpResponse } from 'msw';
import { AuthResponse, TokenResponse, UserInfo } from '@recipot/types';

import { mockUsers } from '../data/users.mock';

// Mock 토큰 검증 헬퍼 함수
const isValidMockToken = (token: string): boolean => {
  return (
    token.includes('mock_token') ||
    token.includes('kakao_mock_token') ||
    token.includes('google_mock_token') ||
    token.includes('refreshed_kakao_mock_token') ||
    token.includes('refreshed_google_mock_token') ||
    token.includes('refreshed_mock_token') // 기존 호환성
  );
};

const isValidMockRefreshToken = (token: string): boolean => {
  return (
    token.includes('mock_refresh') ||
    token.includes('kakao_mock_refresh') ||
    token.includes('google_mock_refresh') ||
    token.includes('refreshed_kakao_mock_refresh') ||
    token.includes('refreshed_google_mock_refresh') ||
    token.includes('refreshed_mock_refresh') || // 기존 호환성
    token.includes('temp_refresh')
  );
};

// 토큰에서 사용자 제공자 식별
const getUserFromToken = (token: string): UserInfo => {
  if (token.includes('google')) {
    return mockUsers.find(u => u.provider === 'google') || mockUsers[1];
  } else if (token.includes('kakao')) {
    return mockUsers.find(u => u.provider === 'kakao') || mockUsers[0];
  }
  // 기본값은 카카오 사용자
  return mockUsers[0];
};

// 토큰에서 제공자 추출
const getProviderFromToken = (token: string): 'google' | 'kakao' => {
  if (token.includes('google')) {
    return 'google';
  }
  return 'kakao';
};

export const authHandlers = [
  // 카카오 로그인 URL 생성 (실제 백엔드 플로우에 맞게)
  http.get('/v1/login/kakao', async () => {
    await delay(100);
    // 실제로는 카카오 인증 서버 URL을 반환
    // Mock에서는 백엔드 REDIRECT_URI와 일치하는 경로로 리디렉션
    const mockAuthUrl = `/v1/login/kakao/callback?code=mock_auth_code_${Date.now()}`;

    return HttpResponse.json(
      {
        authUrl: mockAuthUrl,
        message: '카카오 인증 URL이 생성되었습니다.',
      },
      { status: 200 }
    );
  }),

  // 카카오 로그인 콜백 (GET 요청으로 수정)
  http.get('/v1/login/kakao/callback', async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      const errorResponse: AuthResponse = {
        success: false,
        error: '카카오 인증 코드가 필요합니다.',
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    await delay(1000);

    const user = mockUsers.find(u => u.provider === 'kakao') || mockUsers[0];
    const tokenData: TokenResponse = {
      accessToken: `kakao_mock_token_${Date.now()}`,
      refreshToken: `kakao_mock_refresh_${Date.now()}`,
      expiresIn: 3600,
    };

    const response = {
      success: true,
      data: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: tokenData.expiresIn,
        user,
      },
      message: '카카오 로그인에 성공했습니다.',
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  // 구글 로그인 URL 생성 (실제 백엔드 플로우에 맞게)
  http.get('/v1/login/google', async () => {
    await delay(100);
    // 실제로는 구글 인증 서버 URL을 반환
    // Mock에서는 백엔드 REDIRECT_URI와 일치하는 경로로 리디렉션
    const mockAuthUrl = `/v1/login/google/callback?code=mock_google_code_${Date.now()}`;

    return HttpResponse.json(
      {
        authUrl: mockAuthUrl,
        message: '구글 인증 URL이 생성되었습니다.',
      },
      { status: 200 }
    );
  }),

  // 구글 로그인 콜백 (GET 요청)
  http.get('/v1/login/google/callback', async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      const errorResponse: AuthResponse = {
        success: false,
        error: '구글 인증 코드가 필요합니다.',
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    await delay(1000);

    const user =
      mockUsers.find(u => u.provider === 'google') ||
      mockUsers[1] ||
      mockUsers[0];
    const tokenData: TokenResponse = {
      accessToken: `google_mock_token_${Date.now()}`,
      refreshToken: `google_mock_refresh_${Date.now()}`,
      expiresIn: 3600,
    };

    const response = {
      success: true,
      data: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: tokenData.expiresIn,
        user,
      },
      message: '구글 로그인에 성공했습니다.',
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  // JWT 토큰 검증
  http.post('/v1/auth/verify', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      const errorResponse: AuthResponse = {
        success: false,
        error: '유효하지 않은 토큰입니다.',
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!isValidMockToken(token)) {
      const errorResponse: AuthResponse = {
        success: false,
        error: '토큰 검증에 실패했습니다.',
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    await delay(300);
    const user = getUserFromToken(token);
    const successResponse: AuthResponse = {
      success: true,
      data: user,
      message: '토큰이 유효합니다.',
    };
    return HttpResponse.json(successResponse, { status: 200 });
  }),

  // 토큰 갱신
  http.post('/v1/auth/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as {
      refreshToken?: string;
    };

    if (!refreshToken || !isValidMockRefreshToken(refreshToken)) {
      return HttpResponse.json(
        { error: '유효하지 않은 리프레시 토큰입니다.' },
        { status: 401 }
      );
    }

    await delay(500);
    const provider = getProviderFromToken(refreshToken);
    const tokenResponse: TokenResponse = {
      accessToken: `refreshed_${provider}_mock_token_${Date.now()}`,
      refreshToken: `refreshed_${provider}_mock_refresh_${Date.now()}`,
      expiresIn: 3600,
    };
    return HttpResponse.json(tokenResponse, { status: 200 });
  }),

  // 현재 사용자 정보 조회
  http.get('/v1/user/profile/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    if (!isValidMockToken(token)) {
      return HttpResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 토큰에서 사용자를 식별
    const user = getUserFromToken(token);

    await delay(300);
    return HttpResponse.json(user, { status: 200 });
  }),

  // 로그아웃
  http.post('/v1/auth/logout', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      const errorResponse: AuthResponse = {
        success: false,
        error: '인증이 필요합니다.',
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    await delay(300);
    const successResponse: AuthResponse = {
      success: true,
      message: '로그아웃되었습니다.',
    };
    return HttpResponse.json(successResponse, { status: 200 });
  }),

  // 개발/테스트용 핸들러들
  http.post('/v1/auth/error-test', async () => {
    await delay(1000);
    const errorResponse: AuthResponse = {
      success: false,
      error: '서버 오류가 발생했습니다.',
    };
    return HttpResponse.json(errorResponse, { status: 500 });
  }),

  http.post('/v1/auth/network-error', async () => {
    await delay(10);
    return HttpResponse.json(
      { error: '네트워크 연결에 실패했습니다.' },
      { status: 503 }
    );
  }),
];
