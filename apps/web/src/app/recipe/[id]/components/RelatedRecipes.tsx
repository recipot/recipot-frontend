import React from 'react';
import Image from 'next/image';

import { CardTimeIcon } from '@/components/Icons';

import type { RecipeCard } from '../types/recipe.types';

interface RelatedRecipesProps {
  relatedRecipes: RecipeCard[];
}

const RelatedRecipes = ({ relatedRecipes }: RelatedRecipesProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-20 mb-5 text-gray-900">다른 레시피는 어떠세요?</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {relatedRecipes.map(card => (
          <div key={card.id} className="rounded-2xl bg-white">
            <div className="relative">
              <div className="absolute top-2 left-2 flex items-center space-x-1 rounded-full px-2 py-1 backdrop-blur-sm">
                <CardTimeIcon className="h-4 w-4" color="#ffffff" />
                <span className="text-xs text-white">{card.time}</span>
              </div>
              <div className="flex items-start">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={780}
                  height={891}
                  className="object-conver"
                />
              </div>
              <div className="absolute right-0 bottom-0 left-0 p-3">
                <p className="line-clamp-2 text-sm font-semibold text-white">
                  {card.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedRecipes;
