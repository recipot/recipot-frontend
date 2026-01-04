'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { PersistentTooltip } from '@/components/common/PersistentTooltip';
import { SettingsIcon } from '@/components/Icons';
import type { User } from '@/types/MyPage.types';

interface UserProfileProps {
  user: User | null;
  showSettingsButton?: boolean;
  isGuest?: boolean;
}

export default function UserProfile({
  isGuest = false,
  showSettingsButton = true,
  user,
}: UserProfileProps) {
  const router = useRouter();

  const handleNavigateToSettings = () => {
    router.push('/mypage/settings');
  };

  const displayName = isGuest ? '게스트' : user?.nickname;
  const displayEmail = isGuest ? null : user?.email;

  const profileImage = (
    <Image
      src="/mypage/img-userProfile.png"
      alt="사용자 프로필 이미지"
      width={54}
      height={54}
      className="overflow-hidden rounded-full"
    />
  );

  return (
    <div className="px-1 py-6">
      <div className="flex items-center gap-4">
        {profileImage}
        <div className="flex flex-1 flex-col gap-[0.188rem]">
          {isGuest ? (
            <PersistentTooltip
              content="로그인하고 내 레시피를 저장하세요"
              side="top"
              align="start"
              sideOffset={8}
            >
              <div className="flex flex-col gap-1">
                <span className="text-20 truncate text-gray-900">
                  {displayName}
                </span>
                <span className="text-16 truncate text-[#999999]">
                  {displayEmail}
                </span>
              </div>
            </PersistentTooltip>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-20 truncate text-gray-900">
                {displayName}
              </span>
              <span className="text-16 truncate text-[#999999]">
                {displayEmail}
              </span>
            </div>
          )}
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
