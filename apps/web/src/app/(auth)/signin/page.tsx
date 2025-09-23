'use client';

import './styles.css';

import { useEffect } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { AuthButtons } from './_components/AuthButtons';
import { IntroSlider } from './_components/IntroSlider';
import { useIntroSlider } from './_components/useIntroSlider';

export default function SignInPage() {
  const { current, handleSlideChange, intro } = useIntroSlider();
  const { googleLogin, loading, login, logout, user } = useAuth();
  const router = useRouter();

  // 로그인 성공 후 온보딩 상태에 따른 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      console.log('사용자 정보:', user);
      console.log('온보딩 완료 상태:', user.isOnboardingCompleted);

      // isOnboardingCompleted가 undefined이거나 false인 경우 온보딩으로 이동
      if (user.isOnboardingCompleted === true) {
        // 온보딩 완료된 사용자는 메인 페이지로 이동
        console.log('온보딩 완료된 사용자 - 메인 페이지로 이동');
        router.push('/');
      } else {
        // 온보딩 미완료 사용자는 온보딩 페이지로 이동
        console.log('온보딩 미완료 사용자 - 온보딩 페이지로 이동');
        router.push('/onboarding');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="mx-auto min-h-screen w-full">
      <IntroSlider
        intro={intro}
        current={current}
        onSlideChange={handleSlideChange}
      />
      {/* TODO: 테스트를 위한 로그인 */}
      {user && process.env.NODE_ENV === 'development' ? (
        <div className="fixed top-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 bg-white/60 px-6 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur">
          {loading && <div>Loading...</div>}
          <div>User: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Provider: {user.provider}</div>
          <div>
            <button onClick={logout}>Logout</button>
            <button onClick={() => router.push('/signin/test')}>
              테스트페이지
            </button>
          </div>
        </div>
      ) : (
        <AuthButtons kakaoLogin={login} googleLogin={googleLogin} />
      )}
    </div>
  );
}
