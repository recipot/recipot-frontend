'use client';

import './styles.css';

import { useEffect, useMemo } from 'react';
import { useAuth } from '@recipot/contexts';
import { getCookie } from '@recipot/utils';
import { useRouter } from 'next/navigation';

import { AuthButtons } from './_components/AuthButtons';
import { IntroSlider } from './_components/IntroSlider';
import { useIntroSlider } from './_components/useIntroSlider';

export default function SignInPage() {
  const { activeIndex, handleSlideChange, intro } = useIntroSlider();
  const { googleLogin, loading, login, token, user } = useAuth();
  const router = useRouter();

  // 🔍 개발 중 확인용: 로그인 상태 콘솔 출력
  useEffect(() => {
    if (user && token) {
      // 쿠키에서 토큰 확인

      const cookieToken =
        getCookie('accessToken') ??
        getCookie('authToken') ??
        getCookie('token');
      const cookieRefresh = getCookie('refreshToken');

      console.info('✅ 로그인 완료!');
      console.info('👤 사용자 정보:', user);
      console.info('🔑 액세스 토큰 (Context):', `${token.substring(0, 20)}...`);
      console.info(
        '💾 LocalStorage 토큰:',
        `${localStorage.getItem('authToken')?.substring(0, 20)}...`
      );
      console.info(
        '🍪 쿠키 토큰:',
        cookieToken ? `${cookieToken.substring(0, 20)}...` : '없음'
      );
      console.info(
        '🍪 쿠키 Refresh:',
        cookieRefresh ? `${cookieRefresh.substring(0, 20)}...` : '없음'
      );
      console.info('📋 모든 쿠키:', document.cookie || '쿠키 없음');
    }
  }, [user, token]);

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
      console.info('👤 사용자 정보:', user);
      console.info('📝 온보딩 상태 (isFirstEntry):', user.isFirstEntry);

      if (!user.isFirstEntry) {
        // 온보딩 완료된 사용자는 메인 페이지로 이동
        console.info('✅ 온보딩 완료된 사용자 - 메인 페이지로 이동');
        router.push('/');
      } else {
        // 온보딩 미완료 사용자는 온보딩 페이지로 이동
        console.info('📝 온보딩 미완료 사용자 - 온보딩 페이지로 이동');
        router.push('/onboarding');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="mx-auto min-h-screen w-full" style={pageStyle}>
      <IntroSlider intro={intro} onSlideChange={handleSlideChange} />
      <AuthButtons
        activeIndex={activeIndex}
        kakaoLogin={login}
        googleLogin={googleLogin}
      />
    </div>
  );
}
