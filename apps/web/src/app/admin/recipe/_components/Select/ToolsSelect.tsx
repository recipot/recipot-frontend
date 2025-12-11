'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Tool {
  id: number;
  name: string;
}

interface ToolsSelectProps {
  availableTools: Tool[];
  selectedToolIds: number[];
  onSelect: (toolIds: number[]) => void;
  onClose: () => void;
}

export function ToolsSelect({
  availableTools,
  onClose,
  onSelect,
  selectedToolIds,
}: ToolsSelectProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(selectedToolIds)
  );
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="absolute left-0 top-0 z-50 min-w-[200px] max-h-48 overflow-auto rounded-md border bg-white shadow-lg"
    >
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
            <span className="whitespace-nowrap text-sm">{tool.name}</span>
          </label>
        ))}
      </div>
      <div className="border-t bg-gray-50 p-2">
        <Button
          onClick={handleSave}
          className="w-full"
          size="sm"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
