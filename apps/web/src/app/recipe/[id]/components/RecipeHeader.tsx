import React, { useMemo } from 'react';

import {
  BackIcon,
  CardTimeIcon,
  CookOrderIcon,
  HeartIcon,
  ShareIcon,
} from '@/components/Icons';

import type { Recipe } from '../types/recipe.types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  const backgroundImageStyle = useMemo(
    () => ({ backgroundImage: `url(${recipe.image})` }),
    [recipe.image]
  );

  return (
    <>
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button className="p-2">
              <BackIcon className="h-6 w-6" color="#212529" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2">
              <ShareIcon className="h-6 w-6" color="#212529" />
            </button>
            <button className="p-2">
              <HeartIcon className="h-6 w-6" color="#212529" />
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Image and Info */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={backgroundImageStyle}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4 left-4 flex space-x-2">
            <div className="flex items-center space-x-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <CardTimeIcon className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">
                {recipe.time}
              </span>
            </div>
            <div className="flex items-center space-x-1 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <CookOrderIcon className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 left-4">
            <h2 className="mb-1 text-lg font-medium text-white">
              {recipe.title}
            </h2>
            <p className="text-2xl leading-tight font-semibold text-white">
              {recipe.subtitle}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeHeader;
