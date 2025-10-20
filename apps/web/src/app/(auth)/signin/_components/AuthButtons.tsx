import { Button } from '@/components/common/Button/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

export function AuthButtons({
  googleLogin,
  kakaoLogin,
}: {
  kakaoLogin: () => void;
  googleLogin: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 bg-white/60 px-6 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur">
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
