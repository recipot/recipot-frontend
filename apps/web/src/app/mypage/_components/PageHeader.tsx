'use client';

import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header';
import type { PageHeaderProps } from '@recipot/types';

export function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <Header>
        <Header.Back onClick={handleBackClick} />
        <Header.Title>{title}</Header.Title>
      </Header>
      <Header.Spacer />
    </>
  );
}
