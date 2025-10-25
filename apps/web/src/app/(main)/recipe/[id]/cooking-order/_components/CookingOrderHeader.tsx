'use client';

import { ArrowLeft } from 'lucide-react';

import { IngredientIcon } from '@/components/Icons';
import type { Recipe } from '@/types/recipe.types';

interface CookingOrderHeaderProps {
  recipe: Recipe;
  onBack: () => void;
  onShowIngredients: () => void;
}

export default function CookingOrderHeader({
  onBack,
  onShowIngredients,
  recipe,
}: CookingOrderHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2">
          <ArrowLeft size={24} className="text-neutral-900" />
        </button>
        <h1 className="text-18 text-neutral-900">{recipe?.title}</h1>
      </div>
      <button
        onClick={onShowIngredients}
        className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-1.5"
      >
        <IngredientIcon size={18} color="#868E96" />
        <span className="text-sm font-bold text-gray-600">재료확인</span>
      </button>
    </div>
  );
}
