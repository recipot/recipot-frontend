'use client';

import { useAuth } from '@recipot/contexts';

export default function Home() {
  const { loading, login, logout, user } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (user) {
    return (
      <div>
        <span>안녕하세요, {user.name}님!</span>
        <button onClick={logout}>로그아웃</button>
      </div>
    );
  }

  return <button onClick={login}>카카오로 로그인</button>;
}
