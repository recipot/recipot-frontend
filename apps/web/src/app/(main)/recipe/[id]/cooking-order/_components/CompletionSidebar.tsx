'use client';

import { Check, X } from 'lucide-react';

import { Button } from '@/components/common/Button';
import type { CookingStep, Recipe } from '@/types/recipe.types';

interface CompletionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  recipe: Recipe;
}

export default function CompletionSidebar({
  isOpen,
  onClose,
  onReset,
  recipe,
}: CompletionSidebarProps) {
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
            <h2 className="text-lg font-semibold text-gray-900">요리 완료!</h2>
            <button onClick={onClose} className="p-1">
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* 완료 메시지 */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check size={32} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">
              {recipe.title} 요리가 완성되었습니다.
            </p>
          </div>

          {/* 완료된 단계들 */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              완료된 단계
            </h3>
            <div className="space-y-2">
              {recipe.cookingSteps.map((step: CookingStep) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-3 rounded-lg bg-green-50 p-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check size={12} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {step.stepNumber}. {step.title}
                    </p>
                    {step.estimatedTime && (
                      <p className="text-xs text-gray-500">
                        {step.estimatedTime}분
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                onClose();
                onReset();
              }}
              className="bg-primary w-full rounded-full py-3 font-semibold text-white"
            >
              다시 요리하기
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full rounded-full py-3 font-semibold"
            >
              레시피 목록으로
            </Button>
          </div>
        </div>
      </button>
    </button>
  );
}
