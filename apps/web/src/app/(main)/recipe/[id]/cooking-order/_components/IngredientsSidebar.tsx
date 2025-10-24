'use client';

import { Button } from '@/components/common/Button';
import { MeasurementGuide } from '@/components/MeasurementGuide';
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
  if (!isOpen) return null;

  // 중복 재료 제거 (name 기준으로 중복 제거)
  const allIngredients = [
    ...recipe.data.ingredients.owned,
    ...recipe.data.ingredients.notOwned,
    ...recipe.data.ingredients.alternativeUnavailable,
  ];

  const uniqueIngredients = allIngredients.filter(
    (ingredient, index, arr) =>
      arr.findIndex(item => item.name === ingredient.name) === index
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="재료 목록 사이드바"
    >
      <button
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        aria-label="사이드바 닫기"
      />
      <div
        className="relative z-10 h-full w-64 bg-white"
        aria-label="재료 목록"
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
              {uniqueIngredients.map((ingredient: RecipeIngredient) => (
                <div
                  key={ingredient.id}
                  className="border-secondary-soft-green bg-secondary-light-green w-fit rounded-md border px-3 py-2"
                >
                  <span className="text-15b mr-[5px] text-[#53880A]">
                    {ingredient.name}
                  </span>
                  <span className="text-15 text-[#53880A]">
                    {ingredient.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 양념류 */}
          <div className="mb-6">
            <div className="mb-3">
              <span className="text-14sb text-gray-900">양념류</span>
            </div>
            <div className="space-y-2 rounded-lg bg-gray-50 p-3">
              {recipe.data.seasonings.map(seasoning => (
                <div key={seasoning.id} className="flex items-center gap-3">
                  {/* TODO : 아이콘 추가 필요 */}
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-15sb mr-2 text-gray-900">
                      {seasoning.name}
                    </span>
                    <div className="mx-[18px] h-1 flex-1 border-b border-dashed border-gray-200" />
                    <span className="text-15 ml-2 text-gray-700">
                      {seasoning.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 계량 가이드 */}
            <div className="mt-5">
              <MeasurementGuide />
            </div>
          </div>

          <Button
            onClick={onClose}
            className="bg-primary w-full rounded-full py-3 font-semibold text-white"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
