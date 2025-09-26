import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { BackIcon, RefreshIcon } from '@/components/Icons';
import { fetchRecipeRecommend } from '@/hooks';

const RecipeHeader = () => {
  const router = useRouter();
  const { refetch } = useQuery({
    queryFn: fetchRecipeRecommend,
    queryKey: ['recipeRecommend'],
    staleTime: 5 * 60 * 1000, // 5분
  });
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-sm items-center justify-between sm:max-w-md md:max-w-lg">
        <BackIcon
          onClick={() => router.push('/')}
          className="cursor-pointer transition-opacity hover:opacity-70"
        />

        <RefreshIcon
          onClick={() => refetch()}
          className="cursor-pointer transition-opacity hover:opacity-70"
        />
      </div>
    </div>
  );
};

export default RecipeHeader;
