import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/mypage/none-refrigerator.png"
          alt="울고있는 밥새"
          width={142}
          height={142}
          priority
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-base text-gray-500">
            요청하신 경로가 올바른지 다시 확인해주세요.
          </p>
        </div>
      </div>
      <Button asChild size="lg" className="px-8">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}
