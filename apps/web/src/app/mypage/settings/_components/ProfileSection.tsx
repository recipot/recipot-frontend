import Image from 'next/image';

import type { ProfileSectionProps } from '@recipot/types';

export default function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <section className="flex items-center gap-4 py-6">
      <Image
        src={user.profileImageUrl}
        alt="사용자 프로필 이미지"
        width={54}
        height={54}
        className="overflow-hidden rounded-full"
      />
      <div className="flex flex-col gap-[0.188rem]">
        <span className="text-20 text-gray-900">{user.nickname}</span>
        <span className="text-16 text-[#999999]">{user.email}</span>
      </div>
    </section>
  );
}
