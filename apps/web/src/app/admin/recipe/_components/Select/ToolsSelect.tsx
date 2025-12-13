'use client';

import { useEffect, useRef, useState } from 'react';
import { recipe } from '@recipot/api';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ToolsSelectProps {
  recipeId: number;
  selectedToolIds: number[];
  onSelect: (toolIds: number[]) => void;
  onClose: () => void;
}

export function ToolsSelect({
  onClose,
  onSelect,
  recipeId,
  selectedToolIds,
}: ToolsSelectProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(selectedToolIds)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // 드롭다운이 열릴 때 API로 조리도구 데이터 가져오기
  const { data: availableTools = [], isLoading: isLoadingTools } = useQuery({
    enabled: recipeId !== undefined && recipeId >= 0,
    queryFn: async () => {
      if (!recipeId || recipeId < 0) return [];
      const data = await recipe.getRecipeTools(recipeId);
      // tools 배열만 반환, toolId를 id로 매핑
      return (
        data?.tools.map(item => ({
          id: item.toolId,
          name: item.name,
        })) ?? []
      );
    },
    queryKey: ['recipe-tools', recipeId],
    staleTime: 0,
    // queryFn이 항상 값을 반환하도록 보장
    placeholderData: [],
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const handleToggle = (toolId: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onSelect(Array.from(selectedIds));
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 z-50 max-h-48 min-w-[200px] overflow-auto rounded-md border bg-white shadow-lg"
    >
      {isLoadingTools ? (
        <div className="p-4 text-center text-sm text-gray-500">로딩 중...</div>
      ) : (
        <>
          <div className="divide-y">
            {availableTools.map(tool => (
              <label
                key={tool.id}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedIds.has(tool.id)}
                  onCheckedChange={() => handleToggle(tool.id)}
                />
                <span className="text-sm whitespace-nowrap">{tool.name}</span>
              </label>
            ))}
          </div>
          <div className="border-t bg-gray-50 p-2">
            <Button onClick={handleSave} className="w-full" size="sm">
              확인
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
