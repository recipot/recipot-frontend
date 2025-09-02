'use client';

import { useAuth } from '@recipot/contexts';

export default function Home() {
  const { googleLogin, loading, login, logout, user } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">
            안녕하세요, {user.name}님!
          </h1>
          <p className="mb-2 text-gray-600">이메일: {user.email}</p>
          <p className="mb-8 text-gray-600">
            로그인 방식:{' '}
            {user.provider === 'kakao'
              ? '카카오'
              : user.provider === 'google'
                ? '구글'
                : user.provider}
          </p>
          <div className="space-x-4">
            <button
              onClick={logout}
              className="rounded bg-gray-500 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-600"
            >
              로그아웃
            </button>
            <a
              href="/test"
              className="inline-block rounded bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              테스트 페이지
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-8 text-3xl font-bold">
          Recipot에 오신 것을 환영합니다!
        </h1>
        <div className="space-x-4">
          <button
            onClick={login}
            className="rounded bg-yellow-400 px-6 py-3 font-medium text-black transition-colors hover:bg-yellow-500"
          >
            카카오로 로그인
          </button>
          <button
            onClick={googleLogin}
            className="rounded bg-red-500 px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
          >
            구글로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
