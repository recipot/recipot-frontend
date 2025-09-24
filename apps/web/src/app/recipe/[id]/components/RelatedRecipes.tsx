import React from 'react';

import { CardTimeIcon } from '@/components/Icons';

import type { RecipeCard } from '../types/recipe.types';

interface RelatedRecipesProps {
  relatedRecipes: RecipeCard[];
}

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({ relatedRecipes }) => {
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-xl font-bold text-gray-900">
        다른 레시피는 어떠세요?
      </h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {relatedRecipes.map(card => (
          <div
            key={card.id}
            className="w-40 flex-shrink-0 overflow-hidden rounded-2xl bg-white"
          >
            <div className="relative h-48 bg-gray-200">
              <div className="absolute top-2 left-2 flex items-center space-x-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
                <CardTimeIcon className="h-4 w-4 text-white" />
                <span className="text-xs text-white">{card.time}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-3">
                <h4 className="line-clamp-2 text-sm font-bold text-white">
                  {card.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedRecipes;
