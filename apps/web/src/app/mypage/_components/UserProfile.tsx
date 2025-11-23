'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { SettingsIcon } from '@/components/Icons';
import type { User } from '@recipot/types';

interface UserProfileProps {
  user: User | null;
  showSettingsButton?: boolean;
}

export default function UserProfile({
  showSettingsButton = true,
  user,
}: UserProfileProps) {
  const router = useRouter();

  const handleNavigateToSettings = () => {
    router.push('/mypage/settings');
  };

  if (!user) return null;

  return (
    <div className="px-1 py-6">
      <div className="flex items-center gap-4">
        <Image
          src="/mypage/img-userProfile.png"
          alt="사용자 프로필 이미지"
          width={54}
          height={54}
          className="overflow-hidden rounded-full"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[0.188rem]">
          <span className="text-20 truncate text-gray-900">
            {user.nickname}
          </span>
          <span className="text-16 truncate text-[#999999]">{user.email}</span>
        </div>
        {showSettingsButton && (
          <Button
            variant="default"
            size="sm"
            shape="square"
            className="gap-1 bg-gray-100 px-2 py-[0.1875rem] active:bg-[#E9ECEF]"
            onClick={handleNavigateToSettings}
          >
            <SettingsIcon size={18} />
            <span className="text-14sb text-gray-600">설정</span>
          </Button>
        )}
      </div>
    </div>
  );
}
