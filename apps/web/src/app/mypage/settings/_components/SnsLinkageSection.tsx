import { Button } from '@/components/common/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';
import type { ProfileSectionProps } from '@/types/MyPage.types';

export default function SnsLinkageSection({ user }: ProfileSectionProps) {
  const isKakaoLinked = user.platform === 'kakao';
  const isGoogleLinked = user.platform === 'google';

  return (
    <section className="py-6">
      <div className="flex items-center justify-between gap-10">
        <div>
          <h2 className="text-18sb text-gray-900">SNS 연동</h2>
          <span className="text-16 text-[#7A8394]">간편 로그인 수단 추가</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="icon-xl"
            shape="round"
            className="bg-kakao"
            disabled={isKakaoLinked}
          >
            <KakaoIcon
              size={28}
              color={isKakaoLinked ? '#9CA3AF' : '#000000'}
            />
          </Button>
          <Button
            size="icon-xl"
            shape="round"
            variant="outline"
            disabled={isGoogleLinked}
          >
            <GoogleIcon
              size={28}
              className={
                isGoogleLinked ? 'border-none opacity-50 grayscale' : ''
              }
            />
          </Button>
        </div>
      </div>
    </section>
  );
}
