'use client';

import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { ArrowIcon } from '@/components/Icons';
import type { Recipe, RecipeIngredient } from '@/types/recipe.types';

interface IngredientsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export function IngredientsSidebar({
  isOpen,
  onClose,
  recipe,
}: IngredientsSidebarProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleToggle = () => {
    setIsGuideOpen(!isGuideOpen);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <section
        className="h-full w-64 bg-white"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full w-full overflow-y-auto p-6 px-6 pt-18 pb-5">
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-18sb text-gray-900">재료</p>
            <div className="flex items-center space-x-2">
              <p className="text-15 text-gray-600">1인분</p>
            </div>
          </div>

          {/* 보유 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-14sb text-gray-900">보유</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.owned.map((ingredient: RecipeIngredient) => (
                <div
                  key={ingredient.id}
                  className="w-fit rounded-md border border-green-200 bg-green-50 px-3 py-2"
                >
                  <span className="text-15b mr-[5px] text-green-700">
                    {ingredient.name}
                  </span>
                  <span className="text-15 text-green-600">
                    {ingredient.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 미보유 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-14sb text-gray-900">미보유</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.notOwned.map(
                (ingredient: RecipeIngredient) => (
                  <div
                    key={ingredient.id}
                    className="w-fit rounded-md border border-orange-200 bg-orange-50 px-3 py-2"
                  >
                    <span className="text-15b mr-[5px] text-[#F88014] opacity-80">
                      {ingredient.name}
                    </span>
                    <span className="text-15 text-[#F88014] opacity-80">
                      {ingredient.amount}
                    </span>
                    {ingredient.isAlternative && (
                      <span className="ml-1 text-xs text-gray-500">
                        대체가능
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* 대체불가 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-14sb text-gray-900">대체불가</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.alternativeUnavailable.map(
                (ingredient: RecipeIngredient) => (
                  <div
                    key={ingredient.id}
                    className="w-fit rounded-md border border-red-200 bg-red-50 px-3 py-2"
                  >
                    <span className="text-15b mr-[5px] text-red-700">
                      {ingredient.name}
                    </span>
                    <span className="text-15 text-red-600">
                      {ingredient.amount}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">필수</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 양념류 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                양념류
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between px-3 py-1.5 transition-colors">
              <div className="text-15sb text-gray-600">계량가이드</div>
              <ArrowIcon
                size={20}
                className={`transition-transform duration-200 ${isGuideOpen ? 'rotate-90' : 'rotate-0'}`}
                onClick={handleToggle}
              />
            </div>
            {isGuideOpen && (
              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-gray-200 py-2">
                  <span className="text-sm text-gray-600">소금</span>
                  <span className="text-sm text-gray-600">1꼬집</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 py-2">
                  <span className="text-sm text-gray-600">간장</span>
                  <span className="text-sm text-gray-600">1스푼</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">고추장</span>
                  <span className="text-sm text-gray-600">1스푼</span>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={onClose}
            className="bg-primary w-full rounded-full py-3 font-semibold text-white"
          >
            확인
          </Button>
        </div>
      </section>
    </div>
  );
}
