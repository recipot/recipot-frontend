import { PageHeader } from '@/components/page/mypage/PageHeader';
import LogoutButton from '@/components/page/mypage/settings/LogoutButton';
import ProfileSection from '@/components/page/mypage/settings/ProfileSection';
import SnsLinkageSection from '@/components/page/mypage/settings/SnsLinkageSection';

const SettingsPage = () => {
  // 임시 유저 데이터
  const user = {
    avatarUrl: '/chick-avatar.png',
    email: 'abc@facebook.com',
    nickname: '오리무중체다치즈',
  };

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
};

export default SettingsPage;
