import { PageHeader } from '@/app/mypage/_components/PageHeader';
import LogoutButton from '@/app/mypage/settings/_components/LogoutButton';
import ProfileSection from '@/app/mypage/settings/_components/ProfileSection';
import SnsLinkageSection from '@/app/mypage/settings/_components/SnsLinkageSection';

// 임시 유저 데이터
const MOCK_USER = {
  avatarUrl: '/mypage/default-profile.png',
  email: 'abc@facebook.com',
  nickname: '오리무중체다치즈',
};

export default function SettingsPage() {
  const user = MOCK_USER;
  return (
    <div className="flex min-h-screen flex-col">
      <div className="px-5">
        <PageHeader title="프로필 설정" />
      </div>

      <main className="flex flex-1 flex-col">
        <div className="px-5">
          <ProfileSection user={user} />
        </div>
        <div className="h-2 bg-gray-50" />
        <div className="px-5">
          <SnsLinkageSection />
        </div>
      </main>

      <LogoutButton />
    </div>
  );
}
