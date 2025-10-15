import Image from 'next/image';

import { ArrowIcon, HeartIcon } from '@/components/Icons';
import type { RecipeCardProps } from '@/types/MyPage.types';

export default function RecipeCard({ onToggleSave, recipe }: RecipeCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white py-3 pr-5 pl-3">
      <div className="relative h-[3.75rem] w-[3.75rem] flex-shrink-0">
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
          <ArrowIcon size={18} color="hsl(var(--gray-900))" />
        </div>
        <p className="text-14 truncate text-gray-600">{recipe.description}</p>
      </div>
      <button onClick={() => onToggleSave(recipe.id)} className="flex-shrink-0">
        <HeartIcon
          size={20}
          active={recipe.isSaved}
          color="hsl(var(--brand-primary))"
        />
      </button>
    </div>
  );
}
