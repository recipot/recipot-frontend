'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/common/Button';
import type { Recipe, RecipeIngredient } from '@/types/recipe.types';

interface IngredientsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export default function IngredientsSidebar({
  isOpen,
  onClose,
  recipe,
}: IngredientsSidebarProps) {
  if (!isOpen) return null;

  return (
    <button
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
      type="button"
    >
      <button
        className="h-full w-64 bg-white"
        onClick={e => e.stopPropagation()}
        type="button"
      >
        <div className="h-full overflow-y-auto p-6">
          {/* 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">재료</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">1인분</span>
              <button onClick={onClose} className="p-1">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* 보유 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-primary text-sm font-semibold">보유</span>
            </div>
            <div className="space-y-2">
              {recipe.ingredients
                .slice(0, 3)
                .map((ingredient: RecipeIngredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-green-700">
                      {ingredient.name} {ingredient.amount}
                      {ingredient.unit}
                    </span>
                    <span className="text-xs text-gray-500">가진재료</span>
                  </div>
                ))}
            </div>
          </div>

          {/* 대체가능 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-orange-500">
                대체가능
              </span>
            </div>
            <div className="space-y-2">
              {recipe.ingredients
                .slice(3, 5)
                .map((ingredient: RecipeIngredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-md border border-orange-200 bg-orange-50 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-orange-700">
                      {ingredient.name} {ingredient.amount}
                      {ingredient.unit}
                    </span>
                    <span className="text-xs text-gray-500">생략가능</span>
                  </div>
                ))}
            </div>
          </div>

          {/* 대체불가 재료 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-red-500">
                대체불가
              </span>
            </div>
            <div className="space-y-2">
              {recipe.ingredients
                .slice(5, 6)
                .map((ingredient: RecipeIngredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2"
                  >
                    <span className="text-sm font-bold text-red-700">
                      {ingredient.name} {ingredient.amount}
                      {ingredient.unit}
                    </span>
                    <span className="text-xs text-gray-500">생략가능</span>
                  </div>
                ))}
            </div>
          </div>

          {/* 양념류 */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                양념류
              </span>
              <button className="flex items-center space-x-1 rounded-md bg-gray-100 px-2 py-1">
                <span className="text-xs text-gray-600">계량가이드</span>
              </button>
            </div>
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
          </div>

          <Button
            onClick={onClose}
            className="bg-primary w-full rounded-full py-3 font-semibold text-white"
          >
            확인
          </Button>
        </div>
      </button>
    </button>
  );
}
