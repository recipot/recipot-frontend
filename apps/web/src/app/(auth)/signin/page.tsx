'use client';

import './styles.css';

import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { AuthButtons } from './_components/AuthButtons';
import { IntroSlider } from './_components/IntroSlider';
import { useIntroSlider } from './_components/useIntroSlider';

export default function SignInPage() {
  const { current, handleSlideChange, intro } = useIntroSlider();
  const { googleLogin, loading, login, logout, user } = useAuth();

  const router = useRouter();

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
