import React, { useMemo } from 'react';

import {
  BackIcon,
  CardTimeIcon,
  CookOrderIcon,
  HeartIcon,
  ShareIcon,
} from '@/components/Icons';
import WebShareButton from '@/components/Share/WebShareButton';

import type { Recipe } from '../types/recipe.types';

interface RecipeHeaderProps {
  recipe: Recipe;
}

const RecipeHeader = ({ recipe }: RecipeHeaderProps) => {
  const backgroundImageStyle = useMemo(
    () => ({ backgroundImage: `url(${recipe.image})` }),
    [recipe.image]
  );

  const handleShareSuccess = () => {
    // console.log('공유가 완료되었습니다.');
  };

  const handleShareError = (error: Error) => {
    console.error('공유 중 오류가 발생했습니다:', error);
  };

  const shareData = useMemo(() => {
    return {
      text: recipe.subtitle,
      title: recipe.title,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
  }, [recipe]);

  return (
    <>
      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <BackIcon size={24} color="#212529" />
          </div>
          <div className="flex items-center space-x-2">
            <WebShareButton
              shareData={shareData}
              onShareSuccess={handleShareSuccess}
              onShareError={handleShareError}
              className="p-2"
            >
              <ShareIcon className="h-6 w-6" color="#212529" />
            </WebShareButton>
            <HeartIcon
              className="h-6 w-6 cursor-pointer stroke-2"
              color="#212529"
            />
          </div>
        </div>
      </div>

      {/* Recipe Image and Info */}
      <div className="relative">
        <div className="h-96 bg-cover bg-center" style={backgroundImageStyle}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4 left-4 flex space-x-2">
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <CardTimeIcon size={24} color="#ffffff" />
              <span className="text-sm font-medium text-white">
                {recipe.time}
              </span>
            </div>
            <div className="flex items-center space-x-1 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <CookOrderIcon size={24} color="#ffffff" />
              <span className="text-sm font-medium text-white">
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 left-4">
            <h2 className="text-17 mb-3 text-white">{recipe.title}</h2>
            <p className="text-24 text-white">{recipe.subtitle}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeHeader;
