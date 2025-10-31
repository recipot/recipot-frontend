import Image from 'next/image';

import { CardTimeIcon, CookOrderIcon } from '@/components/Icons';

import type { Recipe } from '../types/recipe.types';

interface RecipeHeroProps {
  recipe: Recipe;
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  return (
    <div className="relative">
      <div className="h-96 bg-cover bg-center">
        {recipe.images && recipe.images.length > 0 && recipe.images[0]?.imageUrl ? (
          <Image
            key={recipe.id}
            src={recipe.images[0].imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="text-gray-500">이미지 없음</span>
          </div>
        )}

        <div className="absolute top-4 right-4 left-4 flex space-x-2">
          <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
            <CardTimeIcon size={24} color="#ffffff" />
            <span className="text-sm font-medium text-white">
              {recipe.duration}분
            </span>
          </div>
          <div className="flex items-center space-x-1 rounded-full px-3 py-1.5">
            <CookOrderIcon size={24} color="#ffffff" />
            <span className="text-sm font-medium text-white">
              {recipe.condition?.name}
            </span>
          </div>
        </div>
        <div className="absolute right-4 bottom-4 left-4">
          <h2 className="text-17 mb-3 text-white">{recipe.title}</h2>
          <p className="text-24 text-white">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeHero;
