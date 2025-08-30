import { Button } from '@/components/common/Button/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

export function AuthButtons() {
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 로직
    console.log('카카오 로그인');
  };

  const handleGoogleLogin = () => {
    // TODO: 구글 로그인 로직
    console.log('구글 로그인');
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 flex-col items-center gap-3 bg-white/60 px-6 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur">
      <Button
        size="full"
        shape="round"
        className="bg-[#FEE500] text-gray-900 active:bg-[#e5cf00]"
        onClick={handleKakaoLogin}
      >
        <KakaoIcon size={28} />
        카카오로 시작하기
      </Button>
      <Button
        size="full"
        shape="round"
        variant="outline"
        className="bg-white"
        onClick={handleGoogleLogin}
      >
        <GoogleIcon />
        Google로 시작하기
      </Button>
    </div>
  );
}
