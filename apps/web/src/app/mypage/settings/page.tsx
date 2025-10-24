'use client';
import { useAuth } from '@recipot/contexts';

import { PageHeader } from '@/app/mypage/_components/PageHeader';
import LogoutButton from '@/app/mypage/settings/_components/LogoutButton';
import ProfileSection from '@/app/mypage/settings/_components/ProfileSection';
import SnsLinkageSection from '@/app/mypage/settings/_components/SnsLinkageSection';
import { mockUser } from '@/mocks/data/myPage.mock';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="px-5">
        <PageHeader title="프로필 설정" />
      </div>

      <main className="flex flex-1 flex-col">
        <div className="px-6">
          <ProfileSection user={user ?? mockUser} />
        </div>
        <div className="h-2 bg-gray-50" />
        <div className="pr-[1.8125rem] pl-6">
          <SnsLinkageSection user={user ?? mockUser} />
        </div>
      </main>

      <LogoutButton />
    </div>
  );
}
