'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface HealthInfo {
  content: string;
}

interface HealthInfosCellProps {
  value: HealthInfo[];
  isEditing: boolean;
  onChange: (value: HealthInfo[]) => void;
  onBlur: () => void;
}

export function HealthInfosCell({
  isEditing,
  onBlur,
  onChange,
  value = [],
}: HealthInfosCellProps) {
  const [localValue, setLocalValue] = useState<HealthInfo[]>(value || []); // 안전한 초기값
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value || []);
  }, [value]);

  const handleAddInfo = () => {
    setLocalValue([...localValue, { content: '' }]);
  };

  const handleRemoveInfo = (index: number) => {
    const newValue = localValue.filter((_, i) => i !== index);
    setLocalValue(newValue);
  };

  const handleContentChange = (index: number, content: string) => {
    const newValue = [...localValue];
    newValue[index] = { content };
    setLocalValue(newValue);
  };

  const handleSave = () => {
    // 빈 내용 제거
    const filtered = localValue.filter(info => info.content.trim());
    onChange(filtered);
    onBlur();
  };

  const handleCancel = () => {
    setLocalValue(value || []);
    onBlur();
  };

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="min-w-[400px] space-y-2 rounded border bg-white p-2 shadow-lg"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">건강 정보</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddInfo}
          >
            <Plus className="mr-1 h-3 w-3" />
            추가
          </Button>
        </div>

        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {localValue.map((info, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={info.content}
                onChange={e => handleContentChange(index, e.target.value)}
                placeholder="건강 정보를 입력하세요"
                className="min-h-[60px] flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInfo(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {localValue.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-400">
            건강 정보를 추가해주세요
          </div>
        )}

        <div className="flex justify-end gap-2 border-t pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="bg-[#8FB569] hover:bg-[#7a9c57]"
          >
            확인
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40px] items-center">
      {value && value.length > 0 ? (
        <div className="space-y-1">
          {value.map((info, index) => (
            <div key={index} className="text-sm">
              • {info.content}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-400">더블클릭하여 편집</span>
      )}
    </div>
  );
}
