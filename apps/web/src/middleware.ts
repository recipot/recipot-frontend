import { NextRequest, NextResponse } from 'next/server';

const AB_COOKIE_NAME = 'ab-onboarding-variant';
const AB_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30일

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== '/onboarding' && pathname !== '/signin') {
    return NextResponse.next();
  }

  let variant = request.cookies.get(AB_COOKIE_NAME)?.value;

  // 쿠키에 유효한 변형이 없으면 50:50 무작위 배정
  if (variant !== 'A' && variant !== 'B') {
    variant = Math.random() < 0.5 ? 'A' : 'B';
  }

  const response = NextResponse.next();

  // 쿠키 설정 (30일 유지)
  response.cookies.set(AB_COOKIE_NAME, variant, {
    maxAge: AB_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });

  // 서버 컴포넌트에서 읽을 수 있도록 요청 헤더에 추가
  response.headers.set('x-ab-variant', variant);

  return response;
}

export const config = {
  matcher: ['/onboarding', '/signin'],
};
