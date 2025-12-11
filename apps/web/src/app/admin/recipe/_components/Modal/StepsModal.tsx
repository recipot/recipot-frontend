'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { AdminRecipe, RecipeUpdateRequest } from '@recipot/api';

interface Step {
  orderNum: number;
  summary: string;
  content: string;
  imageUrl?: string;
}

interface StepsModalProps {
  closeModal: () => void;
  editedData: Partial<RecipeUpdateRequest> | undefined;
  recipe: AdminRecipe;
  updateEditedRecipe: (
    recipeId: number,
    updates: Partial<RecipeUpdateRequest>
  ) => void;
}

export function StepsModal({
  closeModal,
  editedData,
  recipe,
  updateEditedRecipe,
}: StepsModalProps) {
  const currentSteps = editedData?.steps ?? recipe.steps ?? [];
  const [steps, setSteps] = useState<Step[]>(
    currentSteps.length > 0
      ? currentSteps
      : [{ content: '', imageUrl: '', orderNum: 1, summary: '' }]
  );

  const handleAddStep = () => {
    const newOrderNum =
      steps.length > 0 ? Math.max(...steps.map(s => s.orderNum)) + 1 : 1;
    setSteps([
      ...steps,
      { content: '', imageUrl: '', orderNum: newOrderNum, summary: '' },
    ]);
  };

  const handleRemoveStep = (orderNum: number) => {
    const newSteps = steps
      .filter(s => s.orderNum !== orderNum)
      .map((s, index) => ({ ...s, orderNum: index + 1 }));
    setSteps(newSteps);
  };

  const handleUpdateStep = (orderNum: number, updates: Partial<Step>) => {
    setSteps(
      steps.map(s => (s.orderNum === orderNum ? { ...s, ...updates } : s))
    );
  };

  const handleSave = () => {
    const sortedSteps = [...steps].sort((a, b) => a.orderNum - b.orderNum);
    updateEditedRecipe(recipe.id, { steps: sortedSteps });
    closeModal();
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>요리순서 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {steps.map(step => (
            <div key={step.orderNum} className="space-y-3 rounded border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">단계 {step.orderNum}</h3>
                {steps.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveStep(step.orderNum)}
                  >
                    삭제
                  </Button>
                )}
              </div>
              <div>
                <label htmlFor="summary" className="text-sm font-medium">
                  요약
                </label>
                <Input
                  value={step.summary}
                  onChange={e =>
                    handleUpdateStep(step.orderNum, { summary: e.target.value })
                  }
                  placeholder="요약 입력"
                />
              </div>
              <div>
                <label className="text-sm font-medium">내용</label>
                <Textarea
                  value={step.content}
                  onChange={e =>
                    handleUpdateStep(step.orderNum, { content: e.target.value })
                  }
                  placeholder="내용 입력"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">이미지 URL</label>
                <Input
                  value={step.imageUrl ?? ''}
                  onChange={e =>
                    handleUpdateStep(step.orderNum, {
                      imageUrl: e.target.value,
                    })
                  }
                  placeholder="이미지 URL 입력"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddStep}>
            단계 추가
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
