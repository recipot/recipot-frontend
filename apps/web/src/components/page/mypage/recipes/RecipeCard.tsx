import Image from 'next/image';

import { ArrowIcon, HeartIcon } from '@/components/Icons';
import type { Recipe } from '@/components/page/mypage/MyPage.types';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-grow flex-col justify-between gap-1">
        <div className="flex items-center">
          <h3 className="text-17sb text-gray-900">{recipe.title}</h3>
          <ArrowIcon size={18} color="var(--gray-900)" />
        </div>
        <p className="text-14 overflow-hidden whitespace-nowrap text-gray-600">
          {recipe.description}
        </p>
      </div>
      <button className="flex-shrink-0 text-gray-400 active:text-red-500">
        <HeartIcon color="var(--gray-900)" />
      </button>
    </div>
  );
}
