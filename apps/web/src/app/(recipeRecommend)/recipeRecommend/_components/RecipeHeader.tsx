import React from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/common/Header';
import { RefreshIcon } from '@/components/Icons';

interface RecipeHeaderProps {
  onRefresh?: () => void;
  disabled?: boolean;
}

const RecipeHeader = ({ disabled, onRefresh }: RecipeHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Header>
      <Header.Back onClick={handleBack} />
      <Header.Action
        onClick={onRefresh}
        ariaLabel="새로고침"
        disabled={disabled}
      >
        <RefreshIcon size={24} color={disabled ? '#CED4DA' : '#212529'} />
      </Header.Action>
    </Header>
  );
};

export default RecipeHeader;
