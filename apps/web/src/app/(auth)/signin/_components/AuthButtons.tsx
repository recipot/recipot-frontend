import { useMemo } from 'react';

import { Button } from '@/components/common/Button/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

export function AuthButtons({
  activeIndex,
  googleLogin,
  kakaoLogin,
}: {
  activeIndex: number;
  googleLogin: () => void;
  kakaoLogin: () => void;
}) {
  // 첫 번째 슬라이드(index 0)일 때는 #3D2A58, 아닐 때는 #FFEFC7
  const containerStyle = useMemo(() => {
    const isFirstSlide = activeIndex === 0;
    const baseColor = isFirstSlide ? '#3D2A58' : '#FFEFC7';
    return {
      background: `linear-gradient(to bottom, transparent 0%, ${baseColor} 10%, ${baseColor} 100%)`,
    };
  }, [activeIndex]);

  return (
    <div
      className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 px-6 pt-[36px] pb-[calc(10px+env(safe-area-inset-bottom))]"
      style={containerStyle}
    >
      <Button
        size="full"
        shape="round"
        className="bg-kakao active:bg-kakao-pressed text-gray-900"
        onClick={kakaoLogin}
      >
        <KakaoIcon size={28} />
        카카오로 시작하기
      </Button>
      <Button
        size="full"
        shape="round"
        variant="outline"
        className="bg-white"
        onClick={googleLogin}
      >
        <GoogleIcon />
        Google로 시작하기
      </Button>
    </div>
  );
}
