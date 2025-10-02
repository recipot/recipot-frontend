'use client';

import { useState } from 'react';
import { ChefHat, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';

import { useRecipes } from '../../../hooks/useRecipes';

export default function RecipesPage() {
  const { error, isLoading, recipes } = useRecipes();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredRecipes = recipes.filter(
    recipe =>
      selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'medium':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            레시피를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat size={28} className="text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">레시피 목록</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* 필터 */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('all')}
            >
              전체
            </Button>
            <Button
              variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('easy')}
            >
              쉬움
            </Button>
            <Button
              variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('medium')}
            >
              보통
            </Button>
            <Button
              variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('hard')}
            >
              어려움
            </Button>
          </div>
        </div>

        {/* 레시피 그리드 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <Link
              key={recipe.id}
              href={`/recipe/${recipe.id}/cooking-order`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                {/* 이미지 */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  {recipe.imageUrl ? (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ChefHat size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(
                        recipe.difficulty
                      )}`}
                    >
                      {getDifficultyText(recipe.difficulty)}
                    </span>
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div className="p-4">
                  <h3 className="group-hover:text-primary mb-2 text-lg font-semibold text-gray-900 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {recipe.description}
                  </p>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{recipe.cookingTime}분</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span>{recipe.servings}인분</span>
                      </div>
                    </div>
                    <div className="text-primary font-medium">요리하기 →</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="py-12 text-center">
            <ChefHat size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              해당 조건의 레시피가 없습니다
            </h3>
            <p className="text-gray-600">다른 난이도를 선택해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
