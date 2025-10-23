'use client';

import { useEffect } from 'react';
import { useAuth } from '@recipot/contexts';
import { useRouter } from 'next/navigation';

import { LoadingPage } from '@/components/common/Loading';
import { ReviewRemindBottomSheet } from '@/components/review/ReviewRemindBottomSheet';
import { useSplash } from '@/contexts/SplashContext';

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();
  const { isCompleted } = useSplash();
  useEffect(() => {
    // 로딩 중에는 체크하지 않음
    if (loading) {
      return;
    }

    // 1. 비로그인 사용자 → 로그인 페이지로 이동
    if (!user) {
      router.push('/signin');
      return;
    }

    // 2. 로그인 + 온보딩 미완료 → 온보딩 페이지로 이동
    if (user.isFirstEntry) {
      router.push('/onboarding');
    }
  }, [loading, user, router]);

  // 로딩 중일 때 표시할 화면
  if (loading) {
    return <LoadingPage />;
  }

  // 비로그인 또는 온보딩 미완료인 경우 빈 화면 표시 (리다이렉트 진행 중)
  if (!user || user.isFirstEntry) {
    return null;
  }

  // 정상적으로 로그인하고 온보딩 완료한 사용자만 표시
  return <div>{isCompleted && <ReviewRemindBottomSheet />}</div>;
}
