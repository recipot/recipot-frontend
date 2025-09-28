'use client';

import { useRouter } from 'next/navigation';

import { BackIcon } from '@/components/Icons';
import type { PageHeaderProps } from '@/types/MyPage.types';

export function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <button onClick={handleBackClick} aria-label="뒤로가기">
        <BackIcon size={24} color="var(--gray-900)" />
      </button>
      <h1 className="text-18sb">{title}</h1>
    </div>
  );
}
