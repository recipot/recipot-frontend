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
      {loading && <div>Loading...</div>}
      {user ? (
        <>
          <div>User: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Provider: {user.provider}</div>
          <div>
            <button onClick={logout}>Logout</button>
            <button onClick={() => router.push('/signin/test')}>
              테스트페이지
            </button>
          </div>
        </>
      ) : (
        <AuthButtons kakaoLogin={login} googleLogin={googleLogin} />
      )}
    </div>
  );
}
