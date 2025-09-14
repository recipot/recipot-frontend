import { Button } from '@/components/common/Button';
import { GoogleIcon, KakaoIcon } from '@/components/Icons';

export default function SnsLinkageSection() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between gap-10">
        <div>
          <h2 className="text-18sb text-gray-900">SNS 연동</h2>
          <span className="text-16 text-[#7A8394]">간편 로그인 수단 추가</span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="icon-xl" shape="round" className="bg-[#FCE40B]">
            <KakaoIcon size={28} />
          </Button>
          <Button size="icon-xl" shape="round" variant="outline">
            <GoogleIcon size={28} />
          </Button>
        </div>
      </div>
    </section>
  );
}
