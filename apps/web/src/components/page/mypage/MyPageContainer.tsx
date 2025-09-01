'use client';
import { useRouter } from 'next/navigation';

import { MyPagePresenter } from '@/components/page/mypage/MyPagePresenter';

export const MyPageContainer = () => {
  const router = useRouter();

  const handleGoBack = () => router.back();

  return <MyPagePresenter onGoBack={handleGoBack} />;
};
