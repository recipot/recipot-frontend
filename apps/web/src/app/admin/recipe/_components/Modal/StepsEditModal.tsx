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

interface Step {
  orderNum: number;
  summary: string;
  content: string;
  imageUrl?: string;
}

interface StepsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (steps: Step[]) => void;
  currentSteps: Step[];
}

export function StepsEditModal({
  currentSteps,
  isOpen,
  onClose,
  onSave,
}: StepsEditModalProps) {
  const [steps, setSteps] = useState<Step[]>(
    currentSteps.length > 0
      ? currentSteps
      : [{ orderNum: 1, summary: '', content: '', imageUrl: '' }]
  );

  const handleAddStep = () => {
    const newOrderNum = steps.length > 0 ? Math.max(...steps.map(s => s.orderNum)) + 1 : 1;
    setSteps([...steps, { orderNum: newOrderNum, summary: '', content: '', imageUrl: '' }]);
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
    onSave(sortedSteps);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>요리순서 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.orderNum} className="rounded border p-4 space-y-3">
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
                <label className="text-sm font-medium">요약</label>
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
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

