import Image from 'next/image';

interface User {
  avatarUrl: string;
  nickname: string;
  email: string;
}

interface ProfileSectionProps {
  user: User;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  return (
    <section className="mb-8 flex items-center gap-4">
      <Image
        src={user.avatarUrl}
        alt="프로필 이미지"
        width={64}
        height={64}
        className="rounded-full bg-yellow-200"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{user.nickname}</span>
        <span className="text-sm text-gray-500">
          10자 까지 입력할 수 있어요
        </span>
        <span className="mt-1 text-sm text-gray-500">{user.email}</span>
      </div>
    </section>
  );
};

export default ProfileSection;
