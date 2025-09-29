import React from 'react';
import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';

interface RecipeHeaderProps {
  onRefresh: () => void;
}

const RecipeHeader = ({ onRefresh }: RecipeHeaderProps) => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
        <BackIcon
          onClick={() => router.push('/')}
          className="cursor-pointer transition-opacity hover:opacity-70"
        />

        <RefreshIcon
          onClick={onRefresh}
          className="cursor-pointer transition-opacity hover:opacity-70"
        />
      </div>
    </div>
  );
};

export default RecipeHeader;
