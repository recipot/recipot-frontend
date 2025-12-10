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

interface Seasoning {
  id: number;
  amount: string;
}

interface SeasoningOption {
  id: number;
  name: string;
}

interface SeasoningsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seasonings: Seasoning[]) => void;
  currentSeasonings: Seasoning[];
  availableSeasonings: SeasoningOption[];
}

export function SeasoningsEditModal({
  availableSeasonings,
  currentSeasonings,
  isOpen,
  onClose,
  onSave,
}: SeasoningsEditModalProps) {
  const [seasonings, setSeasonings] = useState<Seasoning[]>(currentSeasonings);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSeasonings = availableSeasonings.filter(seasoning =>
    seasoning.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSeasoning = (seasoningId: number) => {
    if (seasonings.find(sea => sea.id === seasoningId)) {
      return;
    }
    setSeasonings([...seasonings, { amount: '', id: seasoningId }]);
  };

  const handleRemoveSeasoning = (id: number) => {
    setSeasonings(seasonings.filter(sea => sea.id !== id));
  };

  const handleUpdateSeasoning = (id: number, amount: string) => {
    setSeasonings(
      seasonings.map(sea => (sea.id === id ? { ...sea, amount } : sea))
    );
  };

  const handleSave = () => {
    onSave(seasonings);
    onClose();
  };

  const getSeasoningName = (seasoningId: number) => {
    return availableSeasonings.find(s => s.id === seasoningId)?.name ?? '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>양념 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 검색 */}
          <Input
            placeholder="양념 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {/* 선택된 양념 목록 */}
          <div className="space-y-2">
            <h3 className="font-semibold">선택된 양념</h3>
            {seasonings.map(seasoning => (
              <div
                key={seasoning.id}
                className="flex items-center gap-2 rounded border p-2"
              >
                <span className="flex-1 font-medium">
                  {getSeasoningName(seasoning.id)}
                </span>
                <Input
                  className="w-24"
                  placeholder="양"
                  value={seasoning.amount}
                  onChange={e =>
                    handleUpdateSeasoning(seasoning.id, e.target.value)
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveSeasoning(seasoning.id)}
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>

          {/* 양념 목록 */}
          <div className="space-y-2">
            <h3 className="font-semibold">양념 목록</h3>
            <div className="max-h-48 overflow-y-auto rounded border">
              {filteredSeasonings.map(seasoning => (
                <button
                  key={seasoning.id}
                  onClick={() => handleAddSeasoning(seasoning.id)}
                  disabled={seasonings.some(sea => sea.id === seasoning.id)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {seasoning.name}
                </button>
              ))}
            </div>
          </div>
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
