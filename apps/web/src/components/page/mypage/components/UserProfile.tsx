'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { SettingsIcon } from '@/components/Icons';

export default function UserProfile() {
  const router = useRouter();

  const handleNavigateToSettings = () => {
    router.push('/mypage/settings');
  };
  return (
    <div className="py-6">
      <div className="flex items-center gap-4">
        <Image
          src="/mypage/default-profile.png"
          alt="사용자 프로필 이미지"
          width={54}
          height={54}
          className="overflow-hidden rounded-full"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[0.188rem]">
          <span className="text-20 truncate text-gray-900">
            오리무중체다치즈
          </span>
          <span className="text-16 truncate text-[#999999]">
            abc@facebook.com
          </span>
        </div>
        <Button
          variant="default"
          size="sm"
          shape="square"
          className="bg-gray-100 px-2 py-1 active:bg-[#E9ECEF]"
          onClick={handleNavigateToSettings}
        >
          <SettingsIcon size={18} color="var(--gray-600)" />
          <span className="text-14b text-gray-600">설정</span>
        </Button>
      </div>
    </div>
  );
}
