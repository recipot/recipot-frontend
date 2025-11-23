import Image from 'next/image';

import { CardTimeIcon, CookwareIcon } from '@/components/Icons';

import type { Recipe } from '@recipot/types';

interface RecipeHeroProps {
  recipe: Recipe;
}

const gradientOverlayStyle = {
  background:
    'linear-gradient(to bottom, rgba(26, 26, 26, 0), rgba(26, 26, 26, 1))',
} as const;

export function RecipeHero({ recipe }: RecipeHeroProps) {
  return (
    <div className="relative flex h-96 flex-col bg-cover bg-center">
      {recipe.images &&
      recipe.images.length > 0 &&
      recipe.images[0]?.imageUrl ? (
        <Image
          key={recipe.id}
          src={recipe.images[0].imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-200">
          <span className="text-gray-500">이미지 없음</span>
        </div>
      )}

      <div className="absolute top-4 right-4 left-4 flex space-x-2">
        <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
          <CardTimeIcon size={24} color="#ffffff" />
          <span className="text-17 text-white">{recipe.duration}분</span>
        </div>
        {recipe.tools && recipe.tools.length > 0 && (
          <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
            <CookwareIcon size={24} color="#ffffff" />
            <span className="text-17 text-white">
              {recipe.tools.map(tool => tool.name).join(', ')}
            </span>
          </div>
        )}
      </div>
      {/* 하단 그라데이션 오버레이 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={gradientOverlayStyle}
      />
      <div className="relative mt-auto px-6 pb-8">
        <h2 className="text-17 mb-3 text-white">{recipe.title}</h2>
        <p className="text-24 text-white">{recipe.description}</p>
      </div>
    </div>
  );
}

export default RecipeHero;
