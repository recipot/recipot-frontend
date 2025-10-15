import React from 'react';
import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';

interface RecipeHeaderProps {
  onRefresh: () => void;
}

const RecipeHeader = ({ onRefresh }: RecipeHeaderProps) => {
  const router = useRouter();

  return (
    <div className="fixed top-0 right-0 left-0 z-10 flex h-14 items-center justify-between bg-white px-3 py-2">
      <button
        className="flex size-10 items-center justify-center"
        onClick={() => router.back()}
      >
        <BackIcon size={24} />
      </button>

      <button
        className="flex size-10 items-center justify-center"
        onClick={onRefresh}
      >
        <RefreshIcon size={24} />
      </button>
    </div>
  );
};

export default RecipeHeader;
