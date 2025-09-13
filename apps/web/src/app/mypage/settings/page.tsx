import { PageHeader } from '@/components/page/mypage/PageHeader';
import LogoutButton from '@/components/page/mypage/settings/LogoutButton';
import ProfileSection from '@/components/page/mypage/settings/ProfileSection';
import SnsLinkageSection from '@/components/page/mypage/settings/SnsLinkageSection';

const SettingsPage = () => {
  const user = {
    avatarUrl: '/chick-avatar.png',
    email: 'abc@facebook.com',
    nickname: '오리무중체다치즈',
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <PageHeader title="프로필 설정" />

      <main className="flex flex-1 flex-col p-4">
        <ProfileSection user={user} />
        <SnsLinkageSection />
      </main>

      <LogoutButton />
    </div>
  );
};

export default SettingsPage;
