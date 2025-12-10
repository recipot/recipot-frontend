'use client';

import { useEffect, useRef, useState } from 'react';

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
      className="absolute z-50 max-h-48 w-full overflow-auto border border-gray-300 bg-white shadow-lg"
    >
      {availableTools.map(tool => (
        <label
          key={tool.id}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-100"
        >
          <input
            type="checkbox"
            checked={selectedIds.has(tool.id)}
            onChange={() => handleToggle(tool.id)}
            className="h-4 w-4"
          />
          <span>{tool.name}</span>
        </label>
      ))}
      <div className="border-t p-2">
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 w-full rounded px-3 py-1 text-sm text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
