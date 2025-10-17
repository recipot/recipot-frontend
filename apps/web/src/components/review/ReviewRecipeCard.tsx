'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowIcon } from '../Icons';

interface ReviewRecipeData {
  alt: string;
  description: string;
  id: number;
  imageUrl: string;
  title: string;
}

interface ReviewRecipeCardProps {
  onClick: () => void;
  recipe: ReviewRecipeData;
}

export function ReviewRecipeCard({ onClick, recipe }: ReviewRecipeCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center text-left"
      aria-label={`${recipe.title} 레시피 리뷰 작성하기`}
      onClick={onClick}
    >
      <article className="flex w-full items-center">
        <div className="mr-4 flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#edf0f7]">
          <Image
            src={recipe.imageUrl}
            alt={recipe.alt}
            width={72}
            height={72}
            className="object-cover"
          />
        </div>
        <div className="mr-2 min-w-0 flex-1">
          <p className="text-15 mb-1 text-gray-600">{recipe.description}</p>
          <h2 className="text-20 truncate text-gray-900">{recipe.title}</h2>
        </div>
        <div className="flex-shrink-0" aria-hidden="true">
          <ArrowIcon size={18} color="#212529" />
        </div>
      </article>
    </button>
  );
}

export type { ReviewRecipeData };
