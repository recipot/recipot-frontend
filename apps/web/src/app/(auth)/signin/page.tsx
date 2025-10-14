'use client';

import './styles.css';

import { useEffect, useMemo } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { AuthButtons } from './_components/AuthButtons';
import { IntroSlider } from './_components/IntroSlider';
import { useIntroSlider } from './_components/useIntroSlider';

/**
 * 온보딩 완료 상태를 안전하게 확인하는 함수
 * @param isOnboardingCompleted - 온보딩 완료 상태 (boolean | undefined)
 * @returns true인 경우에만 true, 그 외 모든 경우 false
 */
const isOnboardingComplete = (
  isOnboardingCompleted: boolean | undefined
): boolean => {
  return isOnboardingCompleted === true;
};

export default function SignInPage() {
  const { activeIndex, handleSlideChange, intro } = useIntroSlider();
  const { googleLogin, loading, login, logout, user } = useAuth();
  const router = useRouter();

  // 슬라이드별 페이지 배경색 설정
  const pageStyle = useMemo(() => {
    const isFirstSlide = activeIndex === 0;
    return {
      backgroundColor: isFirstSlide ? '#3D2A58' : '#FFEFC7',
    };
  }, [activeIndex]);

  // 로그인 성공 후 온보딩 상태에 따른 리다이렉트
  useEffect(() => {
    if (user && !loading) {
      console.info('사용자 정보:', user);
      console.info('온보딩 완료 상태:', user.isOnboardingCompleted);

      if (isOnboardingComplete(user.isOnboardingCompleted)) {
        // 온보딩 완료된 사용자는 메인 페이지로 이동
        console.info('온보딩 완료된 사용자 - 메인 페이지로 이동');
        router.push('/');
      } else {
        // 온보딩 미완료 사용자 (undefined, false, null 모두 포함)
        const status =
          user.isOnboardingCompleted === undefined
            ? '상태 미정의'
            : user.isOnboardingCompleted === false
              ? '미완료'
              : '기타';
        console.info(`온보딩 ${status} 사용자 - 온보딩 페이지로 이동`);
        router.push('/onboarding');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="mx-auto min-h-screen w-full" style={pageStyle}>
      <IntroSlider intro={intro} onSlideChange={handleSlideChange} />
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
        <AuthButtons
          activeIndex={activeIndex}
          kakaoLogin={login}
          googleLogin={googleLogin}
        />
      )}
    </div>
  );
}
